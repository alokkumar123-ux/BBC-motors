import { createFileRoute } from "@tanstack/react-router";
import { Camera, Image as ImageIcon, Trash2, Upload, UserPlus } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { DataTable, PageHeading, Panel, StatusPill } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COURSES, type CourseCode, type Student, formatDateLong, useStudents, saveStudent, deleteStudent, generateNextEnrollmentNo } from "@/lib/school-data";

export const Route = createFileRoute("/admin/students")({
  head: () => ({ meta: [{ title: "Students — BBC Motors Admin" }, { name: "description", content: "All enrolled students." }] }),
  component: StudentsPage,
});

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Field({ id, label, children }: { id?: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-1 pt-3">
      <p className="text-xs font-bold uppercase tracking-widest text-[#164535]">{children}</p>
    </div>
  );
}

function AddStudentForm({ students, onDone }: { students: Student[]; onDone: () => void }) {
  const [sameAddress, setSameAddress] = useState(false);
  const [photo, setPhoto] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<CourseCode>("LMV");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewEnrollmentNo = generateNextEnrollmentNo(students, selectedCourse);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG)");
      return;
    }

    // Read and compress image to reasonable dimensions for Firestore document storage
    const reader = new FileReader();
    reader.onerror = () => {
      toast.error("Could not read image file");
    };
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (!base64) return;

      // Immediately display the photo preview so the user sees it instantly
      setPhoto(base64);
      toast.success("Passport photo selected");

      // Background compression to save bandwidth & Firestore storage
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 360;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.82);
            setPhoto(compressed);
          }
        } catch {
          // Keep original base64 if canvas is unavailable
        }
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);

    // Reset so selecting the same file again triggers onChange
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();

    const course = get("course") as CourseCode;
    const next: Student = {
      id: generateNextEnrollmentNo(students, course),
      name: get("name"),
      photo: photo || undefined,
      fatherOrHusbandName: get("fatherOrHusbandName"),
      gender: get("gender") as Student["gender"],
      dob: get("dob"),
      bloodGroup: get("bloodGroup"),
      qualification: get("qualification"),
      occupation: get("occupation"),
      permanentAddress: get("permanentAddress"),
      presentAddress: sameAddress ? get("permanentAddress") : get("presentAddress"),
      phone: get("phone"),
      email: get("email"),
      course: get("course") as CourseCode,
      enrolledOn: get("enrolledOn") || new Date().toISOString().slice(0, 10),
      completionDate: get("completionDate"),
      learnerLicenseNo: get("learnerLicenseNo"),
      learnerLicenseExpiry: get("learnerLicenseExpiry"),
      drivingLicenseNo: get("drivingLicenseNo"),
      drivingLicenseIssueDate: get("drivingLicenseIssueDate"),
      amountPaid: get("amountPaid"),
      paymentMethod: get("paymentMethod") as Student["paymentMethod"],
      remarks: get("remarks"),
      status: "Enrolled",
      progress: 0,
    };

    await saveStudent(next);
    toast.success(`${next.name} (${next.id}) saved to database`);
    onDone();
  }

  const inputCls = "h-9 w-full border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#164535] rounded-none";
  const selectCls = inputCls;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[75vh] pr-1">

      {/* ── Photo Upload Section (Top of Form 14) ── */}
      <div className="border border-border/80 bg-muted/20 p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Photo Preview Box (Passport Size 3:4) */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Click to select photo"
            className="group relative h-28 w-24 shrink-0 border-2 border-dashed border-[#164535]/40 hover:border-[#164535] bg-white grid place-items-center overflow-hidden transition-colors cursor-pointer"
          >
            {photo ? (
              <>
                <img src={photo} alt="Trainee preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-semibold">
                  Change
                </div>
              </>
            ) : (
              <div className="text-center p-2 group-hover:text-[#164535]">
                <Camera className="mx-auto h-6 w-6 text-slate-400 group-hover:text-[#164535] transition-colors" />
                <span className="text-[10px] text-muted-foreground block mt-1 font-medium">Click to Add</span>
              </div>
            )}
          </button>

          <div className="flex-1 space-y-1.5 text-center sm:text-left">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#164535]">
              Trainee Passport Photograph
            </Label>
            <p className="text-xs text-muted-foreground">
              Upload passport-sized photo for Admission Form &amp; Driving Certificate (JPG, PNG).
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 border border-[#164535] bg-[#164535] hover:bg-[#0e2c22] px-3 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{photo ? "Change Photo" : "Upload Photo"}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  className="inline-flex items-center gap-1 border border-destructive/40 text-destructive hover:bg-destructive/10 px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Personal Information ── */}
      <SectionTitle>Personal Information</SectionTitle>

      <Field id="enrollmentNo" label="Enrollment No (Auto-Generated)">
        <input
          id="enrollmentNo"
          name="enrollmentNo"
          value={previewEnrollmentNo}
          readOnly
          tabIndex={-1}
          className={`${inputCls} bg-muted/60 font-mono font-bold text-[#164535] cursor-not-allowed border-[#164535]/30`}
        />
      </Field>

      <Field id="name" label="Full Name of Trainee *">
        <input id="name" name="name" required placeholder="e.g. Alok Kumar Dey" className={inputCls} />
      </Field>

      <Field id="fatherOrHusbandName" label="Father's / Husband's Name *">
        <input id="fatherOrHusbandName" name="fatherOrHusbandName" required placeholder="e.g. Ratan Dey" className={inputCls} />
      </Field>

      <FieldRow>
        <Field id="gender" label="Gender *">
          <select id="gender" name="gender" required className={selectCls}>
            <option value="">— Select —</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field id="dob" label="Date of Birth *">
          <input id="dob" name="dob" type="date" required className={inputCls} />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field id="bloodGroup" label="Blood Group">
          <select id="bloodGroup" name="bloodGroup" className={selectCls}>
            <option value="">— Unknown —</option>
            {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field id="qualification" label="Qualification">
          <input id="qualification" name="qualification" placeholder="e.g. Graduate" className={inputCls} />
        </Field>
      </FieldRow>

      <Field id="occupation" label="Occupation">
        <input id="occupation" name="occupation" placeholder="e.g. Private Job, Business, Student" className={inputCls} />
      </Field>

      {/* ── Address ── */}
      <SectionTitle>Address</SectionTitle>

      <Field id="permanentAddress" label="Permanent Address *">
        <textarea id="permanentAddress" name="permanentAddress" required rows={2}
          placeholder="Full permanent address" className={`${inputCls} h-auto py-2 resize-none`} />
      </Field>

      <div className="flex items-center gap-2 text-xs">
        <input type="checkbox" id="sameAddress" checked={sameAddress} onChange={(e) => setSameAddress(e.target.checked)} className="accent-[#164535]" />
        <label htmlFor="sameAddress" className="cursor-pointer text-muted-foreground">Present address same as permanent</label>
      </div>

      {!sameAddress && (
        <Field id="presentAddress" label="Present Address *">
          <textarea id="presentAddress" name="presentAddress" required={!sameAddress} rows={2}
            placeholder="Full present address" className={`${inputCls} h-auto py-2 resize-none`} />
        </Field>
      )}

      {/* ── Contact ── */}
      <SectionTitle>Contact</SectionTitle>

      <FieldRow>
        <Field id="phone" label="Contact No *">
          <input id="phone" name="phone" required placeholder="10-digit mobile" maxLength={10} className={inputCls} />
        </Field>
        <Field id="email" label="Email">
          <input id="email" name="email" type="email" placeholder="optional" className={inputCls} />
        </Field>
      </FieldRow>

      {/* ── Course & Payment ── */}
      <div className="flex items-center justify-between border-b border-border pb-1 pt-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[#164535]">Course & Payment</p>
        <span className="text-[11px] font-semibold bg-[#EAF1ED] text-[#164535] px-2.5 py-0.5 border border-[#164535]/30">
          Auto Assigned Roll / Enrol: <strong className="font-mono">{previewEnrollmentNo}</strong>
        </span>
      </div>

      <FieldRow>
        <Field id="course" label="Class of Vehicle *">
          <select
            id="course"
            name="course"
            required
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value as CourseCode)}
            className={selectCls}
          >
            {COURSES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </Field>
        <Field id="enrolledOn" label="Date of Enrolment *">
          <input id="enrolledOn" name="enrolledOn" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={inputCls} />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field id="amountPaid" label="Fee / Amount Paid (₹) *">
          <input
            id="amountPaid"
            name="amountPaid"
            type="number"
            min="0"
            step="1"
            required
            placeholder="e.g. 3500"
            className={inputCls}
          />
        </Field>
        <Field id="paymentMethod" label="Payment Method *">
          <select id="paymentMethod" name="paymentMethod" required className={selectCls}>
            <option value="">— Select —</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI / Online</option>
            <option value="Card">Card / Debit</option>
            <option value="Cheque">Cheque / DD</option>
          </select>
        </Field>
      </FieldRow>

      <Field id="completionDate" label="Expected Completion Date">
        <input id="completionDate" name="completionDate" type="date" className={inputCls} />
      </Field>

      {/* ── License Details ── */}
      <SectionTitle>License Details</SectionTitle>

      <FieldRow>
        <Field id="learnerLicenseNo" label="Learner License No">
          <input id="learnerLicenseNo" name="learnerLicenseNo" placeholder="e.g. AS09-20250011" className={inputCls} />
        </Field>
        <Field id="learnerLicenseExpiry" label="LL Expiry Date">
          <input id="learnerLicenseExpiry" name="learnerLicenseExpiry" type="date" className={inputCls} />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field id="drivingLicenseNo" label="Driving License No">
          <input id="drivingLicenseNo" name="drivingLicenseNo" placeholder="e.g. AS09 20261043" className={inputCls} />
        </Field>
        <Field id="drivingLicenseIssueDate" label="DL Issue Date">
          <input id="drivingLicenseIssueDate" name="drivingLicenseIssueDate" type="date" className={inputCls} />
        </Field>
      </FieldRow>

      {/* ── Remarks ── */}
      <SectionTitle>Remarks</SectionTitle>
      <Field id="remarks" label="Remarks">
        <textarea id="remarks" name="remarks" rows={2} placeholder="Any additional notes" className={`${inputCls} h-auto py-2 resize-none`} />
      </Field>

      <Button type="submit" className="w-full bg-[#164535] hover:bg-[#0e2c22] text-white font-semibold rounded-none mt-2">
        Save Student to Database
      </Button>
    </form>
  );
}

function StudentsPage() {
  const { students, loading } = useStudents();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(s: Student) {
    if (!confirm(`Are you sure you want to permanently delete trainee ${s.name} (${s.id})?`)) {
      return;
    }
    setDeletingId(s.id);
    try {
      await deleteStudent(s.id);
      toast.success(`Student ${s.name} (${s.id}) deleted successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete student");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = students.filter((s) => {
    const haystack = [s.name, s.id, s.phone, s.fatherOrHusbandName].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <>
      <PageHeading
        title="Students"
        subtitle={loading ? "Loading from database..." : `${students.length} students enrolled`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#164535] hover:bg-[#0e2c22] text-white rounded-none">
                <UserPlus className="h-4 w-4" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-none">
              <DialogHeader>
                <DialogTitle className="text-[#164535] font-extrabold text-lg">
                  Add New Student — Admission Form
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Form 14 · See Rule 27(a) · BBC Motors Driving School · DTK/MDLS/02/2004
                </p>
              </DialogHeader>
              <AddStudentForm students={students} onDone={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      <Panel>
        <Input
          placeholder="Search by name, ID, phone or guardian"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4 max-w-sm rounded-none"
        />
        <DataTable
          head={["Enrollment No", "Trainee", "Guardian", "Course", "Fee Paid", "Phone", "Enrolled", "Status", "Action"]}
          rows={filtered.map((s) => [
            <span className="font-mono font-bold text-xs text-[#164535] bg-[#EAF1ED] px-2 py-0.5 border border-[#164535]/20">{s.id}</span>,
            <div className="flex items-center gap-2.5">
              {s.photo ? (
                <img src={s.photo} alt={s.name} className="h-8 w-7 object-cover border border-slate-300 shrink-0" />
              ) : (
                <div className="grid h-8 w-7 place-items-center bg-slate-100 border border-slate-200 text-slate-400 shrink-0">
                  <ImageIcon className="h-3.5 w-3.5" />
                </div>
              )}
              <div>
                <p className="font-semibold text-sm">{s.name}</p>
                {s.gender && <p className="text-xs text-muted-foreground">{s.gender}{s.bloodGroup ? ` · ${s.bloodGroup}` : ""}</p>}
              </div>
            </div>,
            <span className="text-xs text-muted-foreground">{s.fatherOrHusbandName ?? "—"}</span>,
            s.course,
            <div>
              <span className="font-bold text-slate-800 text-xs">
                {s.amountPaid ? `₹${Number(s.amountPaid).toLocaleString("en-IN")}` : "—"}
              </span>
              {s.paymentMethod && (
                <span className="block text-[10px] text-muted-foreground">{s.paymentMethod}</span>
              )}
            </div>,
            s.phone,
            formatDateLong(s.enrolledOn),
            <select
              value={s.status}
              onChange={async (e) => {
                await saveStudent({ ...s, status: e.target.value as Student["status"] });
                toast.success("Status updated");
              }}
              className="text-xs border border-border px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-[#164535]"
            >
              <option value="Enrolled">Enrolled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>,
            <button
              type="button"
              disabled={deletingId === s.id}
              onClick={() => handleDelete(s)}
              title="Delete Student"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-destructive border border-destructive/30 hover:bg-destructive hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{deletingId === s.id ? "Deleting..." : "Delete"}</span>
            </button>,
          ])}
        />
      </Panel>
    </>
  );
}
