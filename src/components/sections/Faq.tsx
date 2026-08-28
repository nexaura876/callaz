import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  entries: { q: string; a: string }[];
};

/**
 * Built on details rather than a state-driven accordion: it opens without
 * JavaScript, and the answers are in the markup where Google can read them.
 */
export function Faq({ eyebrow, title, entries }: Props) {
  return (
    <section className="container-page py-24 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-24">
        <SectionHeading eyebrow={eyebrow} title={title} />

        <div className="border-t border-line">
          {entries.map((entry, index) => (
            <Reveal key={entry.q} delay={index * 60}>
              <details className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left marker:content-none">
                  <span className="font-display text-lg font-semibold text-heading">
                    {entry.q}
                  </span>
                  <span className="text-muted hairline mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full transition group-hover:bg-panel-2 group-hover:text-heading">
                    <Icon
                      name="chevron-down"
                      className="size-4 transition-transform duration-300 group-open:rotate-180"
                    />
                  </span>
                </summary>
                <p className="text-muted max-w-2xl pr-14 pb-7 leading-relaxed">
                  {entry.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
