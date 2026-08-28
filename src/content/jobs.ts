import type { Office } from "./company";
import { offices } from "./company";

export type Job = {
  slug: string;
  /** An empty array means the role is remote or nationwide. */
  offices: Office["id"][];
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR";
  /** Bullet counts under careers.jobs.<slug> in the messages. */
  responsibilities: number;
  requirements: number;
  featured?: boolean;
  remote?: boolean;
};

/**
 * Openings are content, not code — but they carry structured data, so they live
 * here rather than in a CMS until there is a reason to add one.
 */
export const jobs: Job[] = [
  {
    slug: "sales-agent",
    offices: ["kolding"],
    employmentType: "FULL_TIME",
    responsibilities: 5,
    requirements: 5,
    featured: true,
  },
  {
    slug: "team-lead",
    offices: ["kolding"],
    employmentType: "FULL_TIME",
    responsibilities: 5,
    requirements: 5,
  },
];

export function getJob(slug: string) {
  return jobs.find((job) => job.slug === slug);
}

export function officesFor(job: Job) {
  return job.offices
    .map((id) => offices.find((office) => office.id === id))
    .filter((office): office is Office => Boolean(office));
}
