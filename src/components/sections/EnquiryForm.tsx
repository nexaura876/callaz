import { getTranslations } from "next-intl/server";
import { company } from "@/content/company";
import { topics, volumes } from "@/lib/enquiry";
import { ContactForm, type FormLabels } from "./ContactForm";

/**
 * The server half of the form. It resolves the copy and hands it down as props, so
 * the client bundle never has to carry the message catalogue.
 */
export async function EnquiryForm() {
  const t = await getTranslations("form");

  const labels: FormLabels = {
    name: t("name"),
    company: t("company"),
    email: t("email"),
    phone: t("phone"),
    topic: t("topic"),
    topicOptions: Object.fromEntries(
      topics.map((topic) => [topic, t(`topics.${topic}`)]),
    ) as FormLabels["topicOptions"],
    volume: t("volume"),
    volumeOptions: Object.fromEntries(
      volumes.map((volume) => [volume, t(`volumes.${volume}`)]),
    ) as FormLabels["volumeOptions"],
    message: t("message"),
    messagePlaceholder: t("messagePlaceholder"),
    consent: t("consent"),
    consentNote: t("consentNote"),
    submit: t("submit"),
    submitting: t("submitting"),
    optional: t("optional"),
    choose: t("choose"),
    errors: {
      name: t("errors.name"),
      company: t("errors.company"),
      email: t("errors.email"),
      phone: t("errors.phone"),
      topic: t("errors.topic"),
      message: t("errors.message"),
      consent: t("errors.consent"),
      rateLimited: t("errors.rateLimited"),
      generic: t("errors.generic", { phone: company.phone }),
    },
  };

  return <ContactForm labels={labels} />;
}
