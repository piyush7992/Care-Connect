import z from "zod";

export const doctorFormSchema = z.object({
  specialty: z.string().min(1, "Specialty is required"),
  experience: z
    .number({ invalid_type_error: "Experience must be a number" })
    .int()
    .min(1, "Experience must be at least 1 year")
    .max(70, "Experience must be less than 70 years"),
  credentialUrl: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Credential URL is required"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
});

export const organizationFormSchema = z.object({
  orgName: z.string().min(2, "Organization name is required"),
  mission: z.string().min(10, "Mission statement is required"),
  contactNumber: z.string().min(10, "Contact number is required"),
  address: z.string().min(5, "Address is required"),
});

export const volunteerFormSchema = z.object({
  skills: z.string().min(2, "Skills are required"),
  languages: z.string().min(2, "Languages are required"),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Expert"]),
});
