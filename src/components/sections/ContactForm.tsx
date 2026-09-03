"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry } from "@/app/[locale]/_actions/enquiry";
import { topics, type EnquiryState } from "@/lib/enquiry";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";

export type FormLabels = {
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  topicOptions: Record<(typeof topics)[number], string>;
  message: string;
  messagePlaceholder: string;
  consent: string;
  consentNote: string;
  submit: string;
  submitting: string;
  choose: string;
  errors: Record<string, string>;
};

const initialState: EnquiryState = { status: "idle" };

// No outline-none here. Tailwind's utilities layer beats the :focus-visible rule in
// globals.css, so suppressing the outline left the controls with nothing but a
// background tint — #f4f8fc to #e9f1f9, about 1.07:1, far under the 3:1 a focus
// indicator needs. The tint stays as a secondary cue; the ring is what carries it.
const controlStyles =
  "w-full rounded-xl bg-panel px-4 py-3 text-heading transition hairline placeholder:text-faint focus:bg-panel-2";

/**
 * appearance-none strips the native dropdown arrow and nothing replaced it, so both
 * selects read as plain text inputs. The chevron is decorative and must not swallow
 * the click that opens the list.
 */
function SelectShell({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block">
      {children}
      <Icon
        name="chevron-down"
        className="text-muted pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
      />
    </span>
  );
}

function SubmitButton({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent text-on-accent hover:bg-accent-strong group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? busy : idle}
      <Icon
        name="arrow-right"
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </button>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-heading">
        {label}
        {hint ? <span className="text-faint ml-1.5 font-normal">({hint})</span> : null}
      </span>
      {children}
      {error ? (
        <span role="alert" className="text-sm font-medium text-red-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}

// Submission order, so the field that gets focus is the first one the visitor would
// reach reading down the form rather than whichever key the validator returned first.
const fieldOrder = [
  "name",
  "company",
  "email",
  "phone",
  "topic",
  "message",
  "consent",
] as const;

export function ContactForm({ labels }: { labels: FormLabels }) {
  const [state, action] = useActionState(submitEnquiry, initialState);
  const formId = useId();
  const errorRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [renderedAt, setRenderedAt] = useState("");

  // Stamped after hydration, so the value is never baked into a statically rendered page.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRenderedAt(String(Date.now()));
  }, []);

  // A form-level failure renders above the fields; moving focus makes sure a screen
  // reader announces it instead of leaving it unread further up the page.
  useEffect(() => {
    if (state.formError) errorRef.current?.focus();
  }, [state.formError]);

  /*
    Field errors render inline with role="alert", but focus stays wherever the
    visitor left it — on a long form that can be several screens above the first
    problem. Only runs when there is no form-level error, which owns focus itself.
  */
  useEffect(() => {
    if (state.formError || !state.fieldErrors) return;

    const first = fieldOrder.find((field) => state.fieldErrors?.[field]);
    if (!first) return;

    formRef.current
      ?.querySelector<HTMLElement>(`[name="${first}"]`)
      ?.focus({ preventScroll: false });
  }, [state.formError, state.fieldErrors]);

  const errorFor = (field: string) => {
    const code = state.fieldErrors?.[field as keyof typeof state.fieldErrors];
    return code ? labels.errors[code] : undefined;
  };

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-6">
      {state.formError ? (
        <p
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200"
        >
          {labels.errors[state.formError]}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={labels.name} error={errorFor("name")}>
          {/* Proper nouns and addresses: the red squiggle is noise, never a correction. */}
          <input
            name="name"
            autoComplete="name"
            spellCheck={false}
            required
            className={cx(controlStyles, errorFor("name") && "border border-red-400/60")}
          />
        </Field>

        <Field label={labels.company} error={errorFor("company")}>
          <input
            name="company"
            autoComplete="organization"
            spellCheck={false}
            required
            className={cx(
              controlStyles,
              errorFor("company") && "border border-red-400/60",
            )}
          />
        </Field>

        <Field label={labels.email} error={errorFor("email")}>
          <input
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            autoCapitalize="none"
            required
            className={cx(controlStyles, errorFor("email") && "border border-red-400/60")}
          />
        </Field>

        <Field label={labels.phone} error={errorFor("phone")}>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className={cx(controlStyles, errorFor("phone") && "border border-red-400/60")}
          />
        </Field>

        <Field label={labels.topic} error={errorFor("topic")}>
          <SelectShell>
            <select
              name="topic"
              defaultValue=""
              required
              className={cx(controlStyles, "appearance-none pr-11")}
            >
              <option value="" disabled>
                {labels.choose}
              </option>
              {topics.map((topic) => (
                <option key={topic} value={topic} className="bg-panel-solid">
                  {labels.topicOptions[topic]}
                </option>
              ))}
            </select>
          </SelectShell>
        </Field>
      </div>

      <Field label={labels.message} error={errorFor("message")}>
        <textarea
          name="message"
          rows={5}
          required
          placeholder={labels.messagePlaceholder}
          className={cx(
            controlStyles,
            "resize-y",
            errorFor("message") && "border border-red-400/60",
          )}
        />
      </Field>

      {/* Honeypot: hidden from people, still filled in by most scripted submissions. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input id={`${formId}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="renderedAt" value={renderedAt} />

      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            className="accent-[var(--c-accent)] mt-1 size-4 shrink-0"
          />
          <span className="text-body text-sm leading-relaxed">{labels.consent}</span>
        </label>
        {errorFor("consent") ? (
          <span role="alert" className="text-sm font-medium text-red-300">
            {errorFor("consent")}
          </span>
        ) : null}
        <p className="text-faint text-xs leading-relaxed">{labels.consentNote}</p>
      </div>

      <SubmitButton idle={labels.submit} busy={labels.submitting} />
    </form>
  );
}
