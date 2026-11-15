import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Eye, FileBadge, FilePlus2, Lock, ShieldCheck, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable, PageHeading, Panel, StatusPill } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  COURSES,
  type Certificate,
  type CourseCode,
  formatDateDMY,
  saveCertificate,
  toggleCertificateRelease,
  useCertificates,
  useStudents,
} from "@/lib/school-data";
import { certificateSlug } from "@/lib/certificate-url";

export const Route = createFileRoute("/admin/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates — BBC Motors Admin" },
      { name: "description", content: "Manage issued driving training certificates and student download permissions." },
    ],
  }),
  component: AdminCertificatesPage,
});

function AdminCertificatesPage() {
  const { certificates, loading } = useCertificates();
  const { students } = useStudents();
  const [open, setOpen] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  // Form state for issuing a new certificate
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [certCourse, setCertCourse] = useState<CourseCode>("LMV");
  const [releaseImmediately, setReleaseImmediately] = useState(true);

  async function handleToggle(cert: Certificate) {
    const nextState = !cert.isReleased;
    setToggling(cert.number);
    try {
      await toggleCertificateRelease(cert.number, nextState);
      toast.success(
        `Download access turned ${nextState ? "ON (Unlocked)" : "OFF (Locked)"} for ${cert.studentName}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update download permission");
    } finally {
      setToggling(null);
    }
  }

  async function handleIssueCertificate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) {
      toast.error("Please select a valid student");
      return;
    }

    const year = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newCertNo = `BBC${year}/${randomSeq}`;

    const newCert: Certificate = {
      number: newCertNo,
      studentId: student.id,
      studentName: student.name,
      course: certCourse,
      issuedOn: new Date().toISOString().slice(0, 10),
      status: "Valid",
      isReleased: releaseImmediately,
    };

    await saveCertificate(newCert);
    toast.success(`Certificate ${newCert.number} issued for ${newCert.studentName}`);
    setOpen(false);
  }

  return (
    <>
      <PageHeading
        title="Certificates Management"
        subtitle={
          loading
            ? "Loading certificates from database..."
            : `${certificates.length} certificates registered · Manage student view & download access`
        }
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#164535] hover:bg-[#0e2c22] text-white rounded-none">
                <FilePlus2 className="h-4 w-4" /> Issue Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-none">
              <DialogHeader>
                <DialogTitle className="text-[#164535] font-extrabold text-lg">
                  Issue Driving Certificate
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Form 5 · Motor Vehicles Driving Regulations · BBC Motors
                </p>
              </DialogHeader>

              <form onSubmit={handleIssueCertificate} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="studentSelect" className="text-xs font-semibold">
                    Select Enrolled Student *
                  </Label>
                  <select
                    id="studentSelect"
                    required
                    value={selectedStudentId}
                    onChange={(e) => {
                      setSelectedStudentId(e.target.value);
                      const s = students.find((item) => item.id === e.target.value);
                      if (s) setCertCourse(s.course);
                    }}
                    className="h-9 w-full border border-input bg-background px-3 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-[#164535]"
                  >
                    <option value="">— Select Trainee —</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.id}) · {s.course}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="certCourse" className="text-xs font-semibold">
                    Course / Vehicle Class *
                  </Label>
                  <select
                    id="certCourse"
                    required
                    value={certCourse}
                    onChange={(e) => setCertCourse(e.target.value as CourseCode)}
                    className="h-9 w-full border border-input bg-background px-3 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-[#164535]"
                  >
                    {COURSES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border border-border/80 p-3 bg-muted/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="releaseImmediately"
                      checked={releaseImmediately}
                      onChange={(e) => setReleaseImmediately(e.target.checked)}
                      className="accent-[#164535]"
                    />
                    <label htmlFor="releaseImmediately" className="text-xs font-semibold cursor-pointer text-slate-800">
                      Enable "View &amp; Download" for student immediately (Turn ON)
                    </label>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-5">
                    If unchecked, the certificate is saved but remains locked in the student portal until you turn it ON.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#164535] hover:bg-[#0e2c22] text-white rounded-none font-semibold text-xs py-2.5"
                >
                  Confirm &amp; Issue Certificate
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Panel>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Use the <strong className="text-slate-800">Student Download Access</strong> column below to Turn ON or Turn OFF download access for any student.
          </p>
        </div>

        <DataTable
          head={["Certificate No", "Student Name", "Course", "Issued", "Status", "Student Download Access", "Preview"]}
          rows={certificates.map((c) => [
            <span className="font-mono text-xs font-bold text-[#164535]">{c.number}</span>,
            <div>
              <p className="font-semibold text-sm text-slate-800">{c.studentName}</p>
              <p className="text-[11px] text-muted-foreground font-mono">ID: {c.studentId}</p>
            </div>,
            <span className="font-medium text-xs">{c.course}</span>,
            <span className="text-xs">{formatDateDMY(c.issuedOn)}</span>,
            <StatusPill status={c.status} />,

            /* Toggle Student Download Access Button */
            <button
              type="button"
              disabled={toggling === c.number}
              onClick={() => handleToggle(c)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all border ${
                c.isReleased
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
              }`}
              title={c.isReleased ? "Click to Turn OFF (Lock Download)" : "Click to Turn ON (Allow Download)"}
            >
              {c.isReleased ? (
                <>
                  <Unlock className="h-3.5 w-3.5 text-emerald-600" />
                  <span>ON (Allowed)</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5 text-amber-600" />
                  <span>OFF (Locked)</span>
                </>
              )}
            </button>,

            <Link
              to="/certificate/$certNo"
              params={{ certNo: certificateSlug(c.number) }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#164535] hover:text-[#C59E53] hover:underline"
            >
              <Eye className="h-3.5 w-3.5" /> View
            </Link>,
          ])}
        />
      </Panel>
    </>
  );
}
