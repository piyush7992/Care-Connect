"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { setOrgVolRole } from "@/actions/onboardingOrgVol";
import { volunteerFormSchema, organizationFormSchema } from "@/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";

export default function OrgVolOnboardingPage() {
  const [step, setStep] = useState("choose-role");
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { loading, data, fn: submitRole } = useFetch(setOrgVolRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(
      step === "organization-form" ? organizationFormSchema : volunteerFormSchema
    ),
    defaultValues: {},
  });

  // Redirect if user already has role
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) return;
    const role = user?.publicMetadata?.role;
    if (role && role !== "UNASSIGNED") {
      router.replace("/dashboard");
    }
  }, [user, isLoaded, router]);

  // Redirect after successful onboarding
  useEffect(() => {
    if (data?.success && data.redirect) {
      router.push(data.redirect);
    }
  }, [data, router]);

  const onOrganizationSubmit = async (formData) => {
    if (loading) return;
    const payload = new FormData();
    payload.append("role", "ORGANIZATION");
    payload.append("orgName", formData.orgName);
    payload.append("mission", formData.orgMission);
    payload.append("contactNumber", formData.orgContactNumber);
    payload.append("address", formData.orgAddress);
    await submitRole(payload);
    router.push("/dashboard");
  };

  const onVolunteerSubmit = async (formData) => {
    if (loading) return;
    const payload = new FormData();
    payload.append("role", "VOLUNTEER");
    payload.append("skills", formData.volSkills);
    payload.append("languages", formData.volLanguages);
    payload.append("experienceLevel", formData.volExperienceLevel);
    await submitRole(payload);
    router.push("/dashboard");
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // STEP 1: Choose Role
  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
          onClick={() => !loading && setStep("organization-form")}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <Users className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-black mb-2">
              Join as an Organization
            </CardTitle>
            <CardDescription className="mb-4">
              Register your organization, share your mission, and manage volunteers
            </CardDescription>
            <Button
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              Continue as Organization
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
          onClick={() => !loading && setStep("volunteer-form")}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <User className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-black mb-2">
              Join as a Volunteer
            </CardTitle>
            <CardDescription className="mb-4">
              Share your skills, languages, and experience level to help organizations
            </CardDescription>
            <Button
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              Continue as Volunteer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // STEP 2: Organization Form
  if (step === "organization-form") {
    return (
      <Card className="border-emerald-900/20">
        <CardContent className="pt-6">
          <div className="mb-6">
            <CardTitle className="text-2xl font-bold text-black mb-2">
              Complete Organization Profile
            </CardTitle>
            <CardDescription>
              Provide your organization details for verification
            </CardDescription>
          </div>

          <form onSubmit={handleSubmit(onOrganizationSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" {...register("orgName")} placeholder="Organization Name" />
              {errors.orgName && <p className="text-red-500">{errors.orgName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mission">Mission Statement</Label>
              <Textarea id="mission" {...register("mission")} placeholder="Mission Statement" />
              {errors.mission && <p className="text-red-500">{errors.mission.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input id="contactNumber" {...register("contactNumber")} placeholder="Contact Number" />
              {errors.contactNumber && <p className="text-red-500">{errors.contactNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} placeholder="Address" />
              {errors.address && <p className="text-red-500">{errors.address.message}</p>}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("choose-role")}
                className="border-emerald-900/30"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Complete Onboarding"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // STEP 3: Volunteer Form
  if (step === "volunteer-form") {
    return (
      <Card className="border-emerald-900/20">
        <CardContent className="pt-6">
          <div className="mb-6">
            <CardTitle className="text-2xl font-bold text-black mb-2">
              Complete Volunteer Profile
            </CardTitle>
            <CardDescription>
              Provide your skills, languages, and experience level
            </CardDescription>
          </div>

          <form onSubmit={handleSubmit(onVolunteerSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input id="skills" {...register("skills")} placeholder="Skills (comma separated)" />
              {errors.skills && <p className="text-red-500">{errors.skills.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <Input id="languages" {...register("languages")} placeholder="Languages spoken" />
              {errors.languages && <p className="text-red-500">{errors.languages.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Input id="experienceLevel" {...register("experienceLevel")} placeholder="Beginner / Intermediate / Expert" />
              {errors.experienceLevel && <p className="text-red-500">{errors.experienceLevel.message}</p>}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("choose-role")}
                className="border-emerald-900/30"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Complete Onboarding"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return null;
}
