import { z } from "zod";

export const topics = [
  "appointmentSetting",
  "outboundSales",
  "customerService",
  "leadGeneration",
  "partnership",
  "careers",
  "other",
] as const;

export const volumes = ["exploring", "small", "medium", "large"] as const;

/**
 * The message on each rule is an error *code*, not a sentence. The action runs on
 * the server and has no business picking a language; the client looks the code up
 * under "form.errors" in whichever locale the visitor is reading.
 */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "name").max(120, "name"),
  company: z.string().trim().min(2, "company").max(160, "company"),
  email: z.string().trim().email("email").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((value) => value === "" || /^[\d\s+()./-]{6,}$/.test(value), "phone")
    .optional()
    .or(z.literal("")),
  topic: z.enum(topics, "topic"),
  volume: z.enum(volumes).optional().or(z.literal("")),
  message: z.string().trim().min(10, "message").max(4000, "message"),
  consent: z.literal("on", "consent"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryState = {
  status: "idle" | "error";
  fieldErrors?: Partial<Record<keyof EnquiryInput, string>>;
  formError?: string;
};

/** Honeypot: the field is hidden from people, so any content in it means a bot. */
export function looksAutomated(formData: FormData) {
  return String(formData.get("website") ?? "").length > 0;
}

/**
 * Second bot check. The form stamps the moment it rendered; a submission arriving
 * within a couple of seconds was not typed by a person. Anything unparseable
 * counts as human, so a skewed clock never costs a real lead.
 */
export function submittedTooFast(formData: FormData, minimumMs = 2500) {
  const stamp = Number(formData.get("renderedAt"));
  if (!Number.isFinite(stamp) || stamp <= 0) return false;
  return Date.now() - stamp < minimumMs;
}

export function parseEnquiry(formData: FormData) {
  return enquirySchema.safeParse({
    name: formData.get("name") ?? "",
    company: formData.get("company") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    topic: formData.get("topic") ?? "",
    volume: formData.get("volume") ?? "",
    message: formData.get("message") ?? "",
    consent: formData.get("consent") ?? "",
  });
}

export function fieldErrorsFrom(error: z.ZodError<EnquiryInput>) {
  const errors: Partial<Record<keyof EnquiryInput, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0] as keyof EnquiryInput | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }

  return errors;
}
