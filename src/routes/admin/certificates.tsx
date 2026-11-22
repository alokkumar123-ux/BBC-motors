import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Eye, FileBadge, FilePlus2, Lock, ShieldCheck, Trash2, Unlock } from "lucide-react";
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
  saveStudent,
  deleteCertificate,
  toggleCertificateRelease,
  useCertificates,
  useStudents,
  generateNextCertificateNo,
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
  const [deletingCertNo, setDeletingCertNo] = useState<string | null>(null);

  // Form state for issuing a new certificate
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [certCourse, setCertCourse] = useState<CourseCode>("LMV");
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [releaseImmediately, setReleaseImmediately] = useState(true);

  const previewCertNo = generateNextCertificateNo(certificates, certCourse);

  // Only students who do not yet have an issued certificate should appear
  const issuedStudentIds = new Set(certificates.map((c) => c.studentId));
  const availableStudents = students.filter((s) => !issuedStudentIds.has(s.id));

  async function handleDeleteCertificate(cert: Certificate) {
    if (!confirm(`Are you sure you want to permanently delete certificate ${cert.number} issued to ${cert.studentName}?`)) {
      return;
    }
    setDeletingCertNo(cert.number);
    try {
      await deleteCertificate(cert.number);
      toast.success(`Certificate ${cert.number} deleted successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete certificate");
    } finally {
      setDeletingCertNo(null);
    }
  }

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

    const newCertNo = generateNextCertificateNo(certificates, certCourse);

    const newCert: Certificate = {
      number: newCertNo,
      studentId: student.id,
      studentName: student.name,
      photo: student.photo,
      course: certCourse,
      issuedOn: issueDate || new Date().toISOString().slice(0, 10),
      status: "Valid",
      isReleased: releaseImmediately,
    };

    await saveCertificate(newCert);
    if (student.status !== "Completed") {
      await saveStudent({ ...student, status: "Completed", progress: 100 });
    }
    toast.success(`Certificate ${newCert.number} issued for ${newCert.studentName}`);
    setSelectedStudentId("");
    setIssueDate(new Date().toISOString().slice(0, 10));
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
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              if (!val) {
                setSelectedStudentId("");
                setIssueDate(new Date().toISOString().slice(0, 10));
              }
            }}
          >
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
                <div className="flex items-center justify-between bg-[#EAF1ED] p-2.5 border border-[#164535]/30">
                  <span className="text-xs text-muted-foreground font-semibold">Auto Certificate No:</span>
                  <span className="font-mono font-bold text-sm text-[#164535]">{previewCertNo}</span>
                </div>

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
                      const s = availableStudents.find((item) => item.id === e.target.value);
                      if (s) setCertCourse(s.course);
                    }}
                    className="h-9 w-full border border-input bg-background px-3 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-[#164535]"
                  >
                    <option value="">
                      {availableStudents.length === 0
                        ? "— All enrolled students already have certificates —"
                        : "— Select Trainee —"}
                    </option>
                    {availableStudents.map((s) => (
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
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="issueDate" className="text-xs font-semibold">
                    Issue Date *
                  </Label>
                  <Input
                    id="issueDate"
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="h-9 w-full border border-input bg-background px-3 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-[#164535]"
                  />
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
                  disabled={!selectedStudentId || availableStudents.length === 0}
                  className="w-full bg-[#164535] hover:bg-[#0e2c22] text-white rounded-none font-semibold text-xs py-2.5 disabled:opacity-50"
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
          head={["Certificate No", "Student Name", "Course", "Issued", "Status", "Student Download Access", "Preview", "Action"]}
          rows={certificates.map((c) => [
            <span className="font-mono text-xs font-bold text-[#164535]">{c.number}</span>,
            <div>
              <p className="font-semibold text-sm text-slate-800">{c.studentName}</p>
              <p className="text-[11px] text-muted-foreground font-mono">Enrol No: {c.studentId}</p>
            </div>,
            <span className="font-medium text-xs">{c.course}</span>,
            <div>
              <input
                type="date"
                value={c.issuedOn ? c.issuedOn.slice(0, 10) : ""}
                onChange={async (e) => {
                  const nextDate = e.target.value;
                  if (!nextDate) return;
                  try {
                    await saveCertificate({ ...c, issuedOn: nextDate });
                    toast.success(`Issue date updated to ${formatDateDMY(nextDate)} for ${c.number}`);
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to update issue date");
                  }
                }}
                title="Click to edit issue date"
                className="h-8 px-2 text-xs border border-input bg-background font-mono rounded-none focus:outline-none focus:ring-1 focus:ring-[#164535] cursor-pointer"
              />
            </div>,
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

            /* Delete Certificate Button */
            <button
              type="button"
              disabled={deletingCertNo === c.number}
              onClick={() => handleDeleteCertificate(c)}
              title="Delete Certificate"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-destructive border border-destructive/30 hover:bg-destructive hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{deletingCertNo === c.number ? "Deleting..." : "Delete"}</span>
            </button>,
          ])}
        />
      </Panel>
    </>
  );
}
