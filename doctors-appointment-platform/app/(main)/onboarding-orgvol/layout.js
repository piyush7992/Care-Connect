// app/(main)/onboarding-orgvol/layout.js
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/onboardingOrgVol";

export const metadata = {
  title: "Onboarding - Care-Connect",
  description: "Complete your profile to get started with Care-Connect",
};

export default async function OrgVolLayout({ children }) {
  // Get current logged-in user
  const user = await getCurrentUser();
  // Redirect users who already have a role
  if (user) {
    if (user.role === "VOLUNTEER") {
      redirect("/dashboard"); // redirect volunteers
    } else if (user.role === "ORGANIZATION") {
      redirect("/dashboard"); // redirect organizations
    } else if (user.role === "ADMIN") {
      redirect("/admin");
    } else if (user.role === "DOCTOR") {
      redirect("/doctor");
    } else if (user.role === "PATIENT") {
      redirect("/doctors");
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black mb-2">
            Welcome to Care-Connect
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us how you want to use the platform
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
