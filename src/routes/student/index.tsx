import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, CalendarRange, CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/portal/PortalShell";
import { CourseProgress } from "@/components/portal/CourseProgress";
import { formatDateLong, useCurrentStudent } from "@/lib/school-data";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "My Dashboard — BBC Motors Student Portal" },
      { name: "description", content: "Your course, enrolment and progress at a glance." },
      { property: "og:title", content: "My Dashboard — BBC Motors" },
      { property: "og:description", content: "Your driving journey, all in one place." },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { student: s } = useCurrentStudent();
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-[#164535]">
          Welcome, {s.name} 👋
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Enrollment No: <span className="font-mono font-semibold text-slate-700">{s.id}</span> · Phone: {s.phone}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { Icon: CalendarRange, label: "Course Enrolled", value: s.course, tone: "text-[#164535]" },
          { Icon: CalendarDays, label: "Enrollment Date", value: formatDateLong(s.enrolledOn), tone: "text-[#C59E53]" },
          { Icon: CheckCircle2, label: "Status", value: s.status, tone: "text-emerald-700" },
        ].map(({ Icon, label, value, tone }) => (
          <div key={label} className="border border-border bg-card p-4 text-center shadow-xs">
            <Icon className={"mx-auto h-7 w-7 " + tone} />
            <p className="mt-3 text-xs font-medium sm:text-sm text-muted-foreground">{label}</p>
            <p className="text-sm font-bold sm:text-base text-slate-800">{value}</p>
          </div>
        ))}
      </div>
      <Panel>
        <CourseProgress student={s} />
        <div className="mt-4 flex justify-end">
          <Link
            to="/student/course"
            className="inline-flex items-center gap-2 border border-[#164535] bg-[#164535] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0e2c22]"
          >
            View Course Details <ArrowRight className="h-4 w-4 text-[#E5C179]" />
          </Link>
        </div>
      </Panel>
    </div>
  );
}
