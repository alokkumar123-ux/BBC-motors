import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, Car, Check, Clock, Truck } from "lucide-react";
import type React from "react";
import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { useCourses } from "@/lib/school-data";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — LMV, MCWG, MCWOG & HMV | BBC Motors Driving School" },
      {
        name: "description",
        content:
          "Govt. authorized driving courses in Karimganj: Light Motor Vehicle (LMV), Motorcycle With Gear (MCWG), Motor Cycle Without Gear (MCWOG), and Heavy Motor Vehicle (HMV).",
      },
      { property: "og:title", content: "Driving Courses at BBC Motors Driving School" },
      {
        property: "og:description",
        content: "LMV, MCWG, MCWOG and HMV vehicle courses with official digital certificates.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CoursesPage,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LMV: Car,
  MCWG: Bike,
  MCWOG: Bike,
  HMV: Truck,
  Transport: Truck,
};

function CoursesPage() {
  const { courses } = useCourses();
  return (
    <SiteLayout>
      <PageIntro eyebrow="Training Programs" title="Our Driving Courses">
        Authorized driving courses under the Government of Assam. Every program includes classroom theory,
        defensive driving habits, and practical road training on certified dual-control vehicles.
      </PageIntro>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => {
          const Icon = ICONS[course.code] ?? Car;
          return (
            <article
              key={course.code}
              className="flex flex-col justify-between border border-border bg-card p-6 shadow-sm transition-all hover:border-[#C59E53] hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center bg-[#EAF1ED] text-[#164535]">
                    <Icon className="h-6 w-6 text-[#164535]" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <Clock className="h-3.5 w-3.5 text-[#C59E53]" /> {course.duration}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-bold text-[#164535]">{course.name}</h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{course.description}</p>

                <ul className="mt-5 space-y-2 text-xs text-foreground/80 border-t border-border pt-4">
                  {course.modules.map((m) => (
                    <li key={m} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" /> {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <Link
                  to="/contact"
                  className="block w-full text-center bg-[#164535] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0e2c22]"
                >
                  Enrol Now
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </SiteLayout>
  );
}
