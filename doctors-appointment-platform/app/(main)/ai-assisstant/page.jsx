// "use client";
// import React from "react";
// import { Circle, PhoneCall, PhoneOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Vapi from "@vapi-ai/web";

// export default function AiAssistantPage() {
//   const [startCall, setStartCall] = React.useState(false);
//   const [elapsed, setElapsed] = React.useState(0);
//   const [currentRole, setCurrentRole] = React.useState("");
//   const [livetranscript, setLiveTranscript] = React.useState("");

//   // ✅ Initialize Vapi only once
//   const vapi = React.useMemo(
//     () => new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY),
//     []
//   );

//   // ✅ Format seconds into MM:SS
//   const formatTime = (seconds) => {
//     const m = String(Math.floor(seconds / 60)).padStart(2, "0");
//     const s = String(seconds % 60).padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   // ✅ Handle timer when call starts/ends
//   React.useEffect(() => {
//     let timer;
//     if (startCall) {
//       timer = setInterval(() => {
//         setElapsed((prev) => prev + 1);
//       }, 1000);
//     } else {
//       setElapsed(0); // reset timer when disconnected
//     }
//     return () => clearInterval(timer);
//   }, [startCall]);

//   const StartCall = () => {
//     vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);

//     vapi.on("call-start", () => {
//       setStartCall(true);
//       console.log("Call started");
//     });

//     vapi.on("call-end", () => {
//       setStartCall(false);
//       console.log("Call ended");
//     });

//     vapi.on("speech-start", () => {
//       console.log("Assistant started speaking");
//       setCurrentRole("assistant");
//     });

//     vapi.on("speech-end", () => {
//       console.log("Assistant stopped speaking");
//       setCurrentRole("user");
//     });

//     vapi.on("message", (message) => {
//       if (message.type === "transcript") {
//         console.log(`${message.role}: ${message.transcript}`);
//         if (message.transcriptType === "partial") {
//           setLiveTranscript(message.transcript);
//           setCurrentRole(message.role);
//         }
//       }
//     });
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
//           <Circle className={startCall ? "text-green-500" : "text-red-500"} />
//           {startCall ? "Connected" : "Not Connected"}
//         </h2>
//         <h2 className="font-bold text-xl text-gray-400">
//           {formatTime(elapsed)}
//         </h2>
//       </div>
//       <div>
//         <h2>
//           {currentRole} : {livetranscript || "No live transcript yet"}
//         </h2>
//       </div>
//       {!startCall ? (
//         <Button onClick={StartCall} className="mt-4 flex items-center gap-2">
//           <PhoneCall /> Start Call
//         </Button>
//       ) : (
//         <Button
//           variant="destructive"
//           className="mt-4 flex items-center gap-2"
//           onClick={() => vapi.stop()} // ✅ Stop call
//         >
//           <PhoneOff /> Disconnect
//         </Button>
//       )}
//     </div>
//   );
// }


"use client";
import React from "react";
import { Circle, PhoneCall, PhoneOff, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import jsPDF from "jspdf"; // ✅ PDF library

export default function AiAssistantPage() {
  const [startCall, setStartCall] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [currentRole, setCurrentRole] = React.useState("");
  const [liveTranscript, setLiveTranscript] = React.useState("");
  const [fullTranscript, setFullTranscript] = React.useState([]); 
  const [lastReport, setLastReport] = React.useState(null); // ✅ Store last report

  const vapi = React.useMemo(
    () => new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY),
    []
  );

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  React.useEffect(() => {
    let timer;
    if (startCall) {
      timer = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(timer);
  }, [startCall]);

  const generatePDFReport = (report) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("📄 Call Report", 10, y);
    y += 15;

    doc.setFontSize(12);
    doc.text(`Duration: ${report.duration}`, 10, y);
    y += 10;
    doc.text(`Ended At: ${report.endedAt}`, 10, y);
    y += 15;

    doc.setFontSize(14);
    doc.text("Summary:", 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(report.summary, 180), 10, y);
    y += 20;

    doc.setFontSize(14);
    doc.text("Transcript:", 10, y);
    y += 10;
    doc.setFontSize(11);

    report.transcript.forEach((t) => {
      const line = `${t.role}: ${t.text}`;
      const splitLines = doc.splitTextToSize(line, 180);
      if (y + splitLines.length * 7 > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(splitLines, 10, y);
      y += splitLines.length * 7;
    });

    doc.save(`call-report-${Date.now()}.pdf`);
  };

  const prepareReport = () => {
    const report = {
      duration: formatTime(elapsed),
      transcript: fullTranscript,
      summary: `Call lasted ${formatTime(elapsed)} with ${
        fullTranscript.length
      } interactions.`,
      endedAt: new Date().toLocaleString(),
    };

    setLastReport(report); // ✅ store for later re-download
    generatePDFReport(report); // auto-download after call ends
  };

  const StartCall = () => {
    vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);

    vapi.on("call-start", () => {
      setStartCall(true);
      setFullTranscript([]);
      setLastReport(null); // clear old report
    });

    vapi.on("call-end", () => {
      setStartCall(false);
      prepareReport(); // ✅ Auto-generate PDF + save in state
    });

    vapi.on("speech-start", () => {
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      setCurrentRole("user");
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        if (message.transcriptType === "partial") {
          setLiveTranscript(message.transcript);
          setCurrentRole(message.role);
        } else if (message.transcriptType === "final") {
          setFullTranscript((prev) => [
            ...prev,
            { role: message.role, text: message.transcript },
          ]);
        }
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className={startCall ? "text-green-500" : "text-red-500"} />
          {startCall ? "Connected" : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">
          {formatTime(elapsed)}
        </h2>
      </div>

      <div>
        <h2>
          {currentRole} : {liveTranscript || "No live transcript yet"}
        </h2>
      </div>

      {!startCall ? (
        <Button onClick={StartCall} className="mt-4 flex items-center gap-2">
          <PhoneCall /> Start Call
        </Button>
      ) : (
        <Button
          variant="destructive"
          className="mt-4 flex items-center gap-2"
          onClick={() => vapi.stop()}
        >
          <PhoneOff /> Disconnect
        </Button>
      )}

      {/* ✅ Extra Download Report button (only after a call ends) */}
      {lastReport && !startCall && (
        <Button
          onClick={() => generatePDFReport(lastReport)}
          className="mt-4 flex items-center gap-2"
        >
          <FileDown /> Download Report Again
        </Button>
      )}
    </div>
  );
}
