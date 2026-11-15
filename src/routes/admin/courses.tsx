import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeading, Panel } from "@/components/portal/PortalShell";
import { COURSES, STUDENTS } from "@/lib/school-data";

export const Route = createFileRoute("/admin/courses")({
  head: () => ({ meta: [{ title: "Courses — BBC Motors Admin" }, { name: "description", content: "Courses, fees and durations." }] }),
  component: () => (
    <>
      <PageHeading title="Courses" subtitle="Training durations and enrolments" />
      <Panel>
        <DataTable
          head={["Code", "Course", "Duration", "Modules", "Active students"]}
          rows={COURSES.map((c) => [
            <span className="font-semibold">{c.code}</span>,
            c.name,
            c.duration,
            c.modules.length,
            STUDENTS.filter((s) => s.course === c.code && s.status !== "Completed").length,
          ])}
        />
      </Panel>
    </>
  ),
});
