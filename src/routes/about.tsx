import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BadgeCheck, CarFront, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import instructorImg from "@/assets/training-instructor.jpg";
import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { SCHOOL } from "@/lib/school-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — BBC Motors Driving School Karimganj" },
      {
        name: "description",
        content:
          "Official Government of Assam authorized driving school in Karimganj (Licence: DTK/MDLS/02/2004), training safe and disciplined drivers since 2004.",
      },
      { property: "og:title", content: "About BBC Motors Driving School" },
      {
        property: "og:description",
        content: "Authorised driving school in Karimganj, Assam, training safe drivers since 2004.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: BadgeCheck, title: "Govt. Authorized", text: `DTO Karimganj Licence No. ${SCHOOL.licenceNo}` },
  { icon: Users, title: "10,000+ Drivers Trained", text: "Over two decades of training across LMV, MCWG & Transport" },
  { icon: CarFront, title: "Dual-Control Fleet", text: "Modern dual-pedal vehicles for guaranteed safety during lessons" },
  { icon: Award, title: "Form 5 Certificates", text: "Official digital certificates with online QR authentication" },
];

function AboutPage() {
  return (
    <SiteLayout>
      <PageIntro eyebrow="Institute Profile" title="About BBC Motors Driving School">
        Authorized by the Transport Department, Government of Assam (Licence: {SCHOOL.licenceNo}).
        Training safe, confident, and defensive drivers in Karimganj for over 20 years.
      </PageIntro>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div className="space-y-4 text-foreground/85 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>BBC Motors Driving School</strong> was established in 2004 with a clear mission: to provide
            rigorous, safety-focused driver training in Karimganj. We operate under the official mandate of the
            Government of Assam's Transport Department.
          </p>
          <p>
            Unlike informal driving lessons, our curriculum integrates the statutory requirements of the Central
            Motor Vehicles Rules (CMVR). Every student completes structured modules covering basic vehicle mechanics,
            traffic sign recognition, defensive driving habits, night driving techniques, and RTO test-track maneuvering.
          </p>
          <p>
            Our dedicated instructors possess extensive certified experience and maintain high standards of patient,
            individualized guidance on dual-control vehicles.
          </p>
          <p>
            Upon successful completion of the course and practical assessments, students are awarded official digital
            certificates equipped with QR verification that can be validated at any time by licensing authorities and employers.
          </p>
          <div className="pt-2">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 border border-brand bg-brand px-5 py-2.5 text-xs font-semibold text-brand-foreground hover:bg-brand/90"
            >
              Explore Our Driving Courses →
            </Link>
          </div>
        </div>

        <div className="overflow-hidden border border-border bg-card shadow-md">
          <img
            src={instructorImg}
            alt="Practical instruction at BBC Motors Driving School, Karimganj"
            className="h-auto w-full object-cover aspect-[4/3]"
          />
          <div className="border-t border-border bg-muted/40 p-4 text-xs">
            <p className="font-bold text-foreground">Accredited Driving Training Academy</p>
            <p className="text-muted-foreground">Station Road, Karimganj, Assam • Estd. 2004</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border border-border bg-card p-6 shadow-sm">
              <Icon className="h-8 w-8 text-brand" strokeWidth={1.8} />
              <p className="mt-3 font-bold text-foreground">{title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
