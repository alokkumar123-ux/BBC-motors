import { createFileRoute } from "@tanstack/react-router";
import { PageHeading, Panel } from "@/components/portal/PortalShell";
import { CourseProgress } from "@/components/portal/CourseProgress";
import { getCourse, useCurrentStudent } from "@/lib/school-data";

export const Route = createFileRoute("/student/course")({
  head: () => ({
    meta: [
      { title: "My Course — BBC Motors Student Portal" },
      { name: "description", content: "Course details and progress." },
    ],
  }),
  component: StudentCoursePage,
});

function StudentCoursePage() {
  const { student } = useCurrentStudent();
  const course = getCourse(student.course);

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeading title="My Course" subtitle={course.name} />
      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Course details">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">Course Code</dt>
              <dd className="font-bold text-[#164535]">{course.code}</dd>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="font-semibold">{course.duration}</dd>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">Training Status</dt>
              <dd className="font-semibold text-emerald-700">{student.status}</dd>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">Progress</dt>
              <dd className="font-bold">{student.progress}%</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{course.description}</p>
        </Panel>
        <Panel title="Syllabus Progress">
          <CourseProgress student={student} />
        </Panel>
      </div>
    </div>
  );
}
