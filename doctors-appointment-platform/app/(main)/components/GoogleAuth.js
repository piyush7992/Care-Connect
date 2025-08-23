// components/GoogleAuth.js
import { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID =
  "1022230871501-vhvbdgrk67cssr9idu0m96abeabkvn6a.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/fitness.activity.read";

export default function GoogleAuth({ onAuthSuccess }) {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn().then(onAuthSuccess);
  };

  return <button onClick={handleLogin}>Connect Google Fit</button>;
}
