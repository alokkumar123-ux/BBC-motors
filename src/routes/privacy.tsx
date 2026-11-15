import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — BBC Motors Driving School" },
      { name: "description", content: "How BBC Motors Driving School collects and uses student information." },
      { property: "og:title", content: "Privacy Policy — BBC Motors" },
      { property: "og:description", content: "How BBC Motors Driving School collects and uses student information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageIntro eyebrow="Legal" title="Privacy Policy" />
      <section className="mx-auto max-w-3xl space-y-4 px-4 py-14 text-foreground/80 sm:px-6">
        <p>We collect your name, phone number, email and course details only to run your training and issue your certificate.</p>
        <p>Certificate verification shows only the student name, course, issue date and certificate number.</p>
        <p>We never sell your information. Contact us to correct or remove your details.</p>
      </section>
    </SiteLayout>
  );
}
