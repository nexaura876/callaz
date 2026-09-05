import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import yusufPhoto from "../../../public/media/team-yusuf.jpg";
import mohammedPhoto from "../../../public/media/team-mohammed.jpg";

/*
 * focus is where object-cover should anchor the crop. Yusuf's photo is a tall
 * portrait with the face near the top, so a centred crop cuts the head off;
 * Mohammed's is almost square and centres correctly on its own.
 */
const members = [
  { id: "yusuf", photo: yusufPhoto, focus: "object-top" } as const,
  { id: "mohammed", photo: mohammedPhoto, focus: "object-center" } as const,
];

/**
 * The two people behind the phone, not a stock photo of a headset. Matches the
 * "named team, not a pool" claim made throughout the rest of the site — a
 * visitor can put a face to who actually picks up.
 */
export async function Team() {
  const t = await getTranslations("about.team");

  return (
    <section className="container-page py-24 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-20">
        <div className="flex flex-col gap-5 lg:sticky lg:top-28">
          <span className="text-accent inline-flex items-center gap-2.5 font-mono text-[0.7rem] font-medium tracking-[0.22em] uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="text-[2rem] leading-[1.1] font-semibold text-heading sm:text-[2.5rem] lg:text-[3rem]">
            {t("title")}
          </h2>
          <p className="text-muted max-w-xl text-lg leading-relaxed">{t("lead")}</p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2">
          {members.map((member, index) => (
            <li key={member.id}>
              <Reveal delay={index * 80} className="h-full">
                <div className="hairline flex h-full flex-col gap-4 rounded-[var(--radius-card)] bg-panel p-6">
                  <div className="relative size-16 overflow-hidden rounded-full">
                    <Image
                      src={member.photo}
                      alt={t(`members.${member.id}.name`)}
                      fill
                      sizes="64px"
                      className={`object-cover ${member.focus}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-lg font-semibold text-heading">
                      {t(`members.${member.id}.name`)}
                    </h3>
                    <p className="text-accent text-sm font-medium">
                      {t(`members.${member.id}.role`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
