import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — BBC Motors Driving School" },
      { name: "description", content: "Terms for enrolment, fees and certificates at BBC Motors Driving School." },
      { property: "og:title", content: "Terms & Conditions — BBC Motors" },
      { property: "og:description", content: "Terms for enrolment, fees and certificates at BBC Motors Driving School." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageIntro eyebrow="Legal" title="Terms & Conditions" />
      <section className="mx-auto max-w-3xl space-y-4 px-4 py-14 text-foreground/80 sm:px-6">
        <p>Course fees are payable at enrolment. Fees are non-refundable once practical training starts.</p>
        <p>Certificates are issued only after all course modules are completed and attendance requirements are met.</p>
        <p>Tampering with or misusing a certificate will lead to its cancellation.</p>
      </section>
    </SiteLayout>
  );
}
