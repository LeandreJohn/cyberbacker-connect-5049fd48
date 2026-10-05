import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/shared/PageHeader";
import { JobDescriptionBuilder } from "@/components/jobs/JobDescriptionBuilder";

export const Route = createFileRoute("/_app/job-builder")({
  head: () => ({
    meta: [
      { title: "Job Description Builder — Cyberbacker" },
      { name: "description", content: "Build a job description with tasks, skills and a training or experienced tier." },
      { property: "og:title", content: "Job Description Builder — Cyberbacker" },
      { property: "og:description", content: "Describe the Cyberbacker you need and find matching candidates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Job Description Builder" description="Describe the role, choose a tier, and match with candidates." />
      <JobDescriptionBuilder />
    </div>
  ),
});
