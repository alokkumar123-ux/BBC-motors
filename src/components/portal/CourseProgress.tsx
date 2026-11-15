import { CheckCircle2, Circle } from "lucide-react";
import { getCourse, type Student } from "@/lib/school-data";

/** Modules count as done in order, rounded from overall progress. */
export function completedModules(student: Student): number {
  const total = getCourse(student.course).modules.length;
  return Math.round((student.progress / 100) * total);
}

export function CourseProgress({ student }: { student: Student }) {
  const modules = getCourse(student.course).modules;
  const done = completedModules(student);
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-bold">
        <span>Course Progress</span>
        <span>{student.progress}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${student.progress}%` }} />
      </div>
      <ul className="mt-5 space-y-3">
        {modules.map((m, i) => (
          <li key={m} className="flex items-center gap-3 text-sm font-medium">
            {i < done ? (
              <CheckCircle2 className="h-6 w-6 fill-success text-success-foreground" />
            ) : (
              <Circle className="h-6 w-6 text-border" />
            )}
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}
