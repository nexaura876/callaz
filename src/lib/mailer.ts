import { company } from "@/content/company";
import type { EnquiryInput } from "./enquiry";

const endpoint = "https://api.resend.com/emails";

/**
 * Collapses control characters, CR and LF included, out of anything that ends up
 * in a mail header.
 *
 * Resend takes JSON rather than raw SMTP, so a newline cannot split a header the
 * classic way. This is belt and braces for the day the transport changes, and it
 * also stops a company name full of line breaks from mangling the subject.
 */
function headerSafe(value: string, maxLength = 120) {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function plainTextBody(enquiry: EnquiryInput) {
  return [
    `Name:      ${enquiry.name}`,
    `Company:   ${enquiry.company}`,
    `Email:     ${enquiry.email}`,
    `Phone:     ${enquiry.phone || "-"}`,
    `Topic:     ${enquiry.topic}`,
    "",
    enquiry.message,
  ].join("\n");
}

/**
 * Delivery goes over the Resend HTTP API rather than their SDK. It is one call,
 * and it saves a dependency. With no key configured the enquiry is logged instead,
 * so the form stays usable locally and in preview builds without any setup.
 *
 * The mail body is English: it is read internally, and the team is mixed.
 */
export async function sendEnquiry(enquiry: EnquiryInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  const to = process.env.ENQUIRY_TO ?? company.email;

  if (!apiKey || !from) {
    console.warn("[enquiry] RESEND_API_KEY or ENQUIRY_FROM missing, nothing sent");
    console.info(plainTextBody(enquiry));
    return;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: enquiry.email,
      subject: `Enquiry from ${headerSafe(enquiry.company, 80)} (${enquiry.topic})`,
      text: plainTextBody(enquiry),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}
