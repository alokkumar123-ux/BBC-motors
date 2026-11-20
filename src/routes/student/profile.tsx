import { createFileRoute } from "@tanstack/react-router";
import { PageHeading, Panel } from "@/components/portal/PortalShell";
import { formatDateLong, useCurrentStudent } from "@/lib/school-data";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [
      { title: "Profile — BBC Motors Student Portal" },
      { name: "description", content: "Your admission and contact details." },
    ],
  }),
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const { student } = useCurrentStudent();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeading title="Trainee Profile" subtitle={`Enrollment No: ${student.id} · Form 14 Record`} />
        {student.photo && (
          <div className="h-24 w-20 border-2 border-[#164535] p-0.5 bg-white shadow-sm shrink-0">
            <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
          </div>
        )}
      </div>
      <Panel title="Personal & Enrolment Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="border border-border/80 p-3 bg-muted/10">
            <span className="text-muted-foreground block text-[11px]">Full Name</span>
            <span className="font-bold text-sm text-slate-800">{student.name}</span>
          </div>

          <div className="border border-border/80 p-3 bg-muted/10">
            <span className="text-muted-foreground block text-[11px]">Father's / Husband's Name</span>
            <span className="font-semibold text-slate-800">{student.fatherOrHusbandName || "—"}</span>
          </div>

          <div className="border border-border/80 p-3 bg-muted/10">
            <span className="text-muted-foreground block text-[11px]">Enrolled Course</span>
            <span className="font-bold text-[#164535]">{student.course}</span>
          </div>

          <div className="border border-border/80 p-3 bg-muted/10">
            <span className="text-muted-foreground block text-[11px]">Enrolment Date</span>
            <span className="font-semibold text-slate-800">{formatDateLong(student.enrolledOn)}</span>
          </div>

          <div className="border border-border/80 p-3 bg-muted/10">
            <span className="text-muted-foreground block text-[11px]">Registered Mobile Number</span>
            <span className="font-mono font-semibold text-slate-800">{student.phone}</span>
          </div>

          <div className="border border-border/80 p-3 bg-muted/10">
            <span className="text-muted-foreground block text-[11px]">Email Address</span>
            <span className="font-semibold text-slate-800">{student.email || "—"}</span>
          </div>

          <div className="border border-border/80 p-3 bg-muted/10">
            <span className="text-muted-foreground block text-[11px]">Gender & Blood Group</span>
            <span className="font-semibold text-slate-800">
              {student.gender || "—"} {student.bloodGroup ? `· Blood: ${student.bloodGroup}` : ""}
            </span>
          </div>

          <div className="border border-border/80 p-3 bg-muted/10">
            <span className="text-muted-foreground block text-[11px]">Date of Birth</span>
            <span className="font-semibold text-slate-800">
              {student.dob ? formatDateLong(student.dob) : "—"}
            </span>
          </div>

          <div className="border border-border/80 p-3 bg-muted/10">
            <span className="text-muted-foreground block text-[11px]">Course Fee Paid</span>
            <span className="font-bold text-slate-800">
              {student.amountPaid ? `₹${Number(student.amountPaid).toLocaleString("en-IN")}` : "—"}
              {student.paymentMethod ? ` (${student.paymentMethod})` : ""}
            </span>
          </div>

          <div className="border border-border/80 p-3 bg-muted/10 sm:col-span-2">
            <span className="text-muted-foreground block text-[11px]">Permanent Address</span>
            <span className="font-medium text-slate-800">{student.permanentAddress || "—"}</span>
          </div>

          {student.learnerLicenseNo && (
            <div className="border border-border/80 p-3 bg-muted/10">
              <span className="text-muted-foreground block text-[11px]">Learner License (LL) No.</span>
              <span className="font-mono font-bold text-slate-800">{student.learnerLicenseNo}</span>
            </div>
          )}

          {student.drivingLicenseNo && (
            <div className="border border-border/80 p-3 bg-muted/10">
              <span className="text-muted-foreground block text-[11px]">Driving License (DL) No.</span>
              <span className="font-mono font-bold text-slate-800">{student.drivingLicenseNo}</span>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
