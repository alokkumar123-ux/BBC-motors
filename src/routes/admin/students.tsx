import { createFileRoute } from "@tanstack/react-router";
import { Camera, Image as ImageIcon, Trash2, Upload, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable, PageHeading, Panel, StatusPill } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COURSES, type CourseCode, type Student, formatDateLong, useStudents, saveStudent } from "@/lib/school-data";

export const Route = createFileRoute("/admin/students")({
  head: () => ({ meta: [{ title: "Students — BBC Motors Admin" }, { name: "description", content: "All enrolled students." }] }),
  component: StudentsPage,
});

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

/** Generates next student ID based on the highest existing STU number */
function nextStudentId(students: Student[]): string {
  const nums = students
    .map((s) => parseInt(s.id.replace("STU-", ""), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1043;
  return `STU-${max + 1}`;
}

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

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read and compress image to reasonable dimensions for Firestore document storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
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
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          setPhoto(compressed);
          toast.success("Passport photo uploaded successfully");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();

    const next: Student = {
      id: nextStudentId(students),
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
      advancePayment: get("advancePayment"),
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
          <div className="relative h-28 w-24 shrink-0 border-2 border-dashed border-[#164535]/40 bg-white grid place-items-center overflow-hidden">
            {photo ? (
              <img src={photo} alt="Trainee preview" className="h-full w-full object-cover" />
            ) : (
              <div className="text-center p-2">
                <Camera className="mx-auto h-6 w-6 text-slate-400" />
                <span className="text-[10px] text-muted-foreground block mt-1">Photo</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1.5 text-center sm:text-left">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#164535]">
              Trainee Passport Photograph
            </Label>
            <p className="text-xs text-muted-foreground">
              Upload passport-sized photo for Admission Form &amp; Driving Certificate (JPG, PNG).
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <label className="cursor-pointer inline-flex items-center gap-1.5 border border-[#164535] bg-[#164535] hover:bg-[#0e2c22] px-3 py-1.5 text-xs font-semibold text-white transition-colors">
                <Upload className="h-3.5 w-3.5" />
                <span>{photo ? "Change Photo" : "Upload Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  className="inline-flex items-center gap-1 border border-destructive/40 text-destructive hover:bg-destructive/10 px-2.5 py-1.5 text-xs font-semibold"
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

      {/* ── Course & Enrolment ── */}
      <SectionTitle>Course & Enrolment</SectionTitle>

      <FieldRow>
        <Field id="course" label="Class of Vehicle *">
          <select id="course" name="course" required className={selectCls}>
            {COURSES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </Field>
        <Field id="enrolledOn" label="Date of Enrolment *">
          <input id="enrolledOn" name="enrolledOn" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={inputCls} />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field id="completionDate" label="Expected Completion Date">
          <input id="completionDate" name="completionDate" type="date" className={inputCls} />
        </Field>
        <Field id="advancePayment" label="Advance Payment (₹)">
          <input id="advancePayment" name="advancePayment" type="number" min="0" placeholder="0" className={inputCls} />
        </Field>
      </FieldRow>

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
  const filtered = students.filter((s) =>
    (s.name + s.id + s.phone + (s.fatherOrHusbandName ?? "")).toLowerCase().includes(query.toLowerCase())
  );

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
          head={["ID", "Trainee", "Guardian", "DOB", "Course", "Phone", "Enrolled", "Status"]}
          rows={filtered.map((s) => [
            <span className="font-mono text-xs">{s.id}</span>,
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
            <span className="text-xs">{s.dob ? formatDateLong(s.dob) : "—"}</span>,
            s.course,
            s.phone,
            formatDateLong(s.enrolledOn),
            <StatusPill status={s.status} />,
          ])}
        />
      </Panel>
    </>
  );
}
