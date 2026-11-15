// Sample data for the BBC Motors Driving School portal.
// Connected to Firebase Firestore with live real-time sync.
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export type CourseCode = "LMV" | "MCWG" | "MCWOG" | "HMV" | "Transport";

export interface Course {
  code: CourseCode;
  name: string;
  duration: string;
  fee?: number;
  description: string;
  modules: string[];
}

export interface Student {
  id: string;
  name: string;
  fatherOrHusbandName: string;
  gender: "Male" | "Female" | "Other";
  dob: string;              // ISO date YYYY-MM-DD
  bloodGroup: string;
  qualification: string;
  occupation: string;
  permanentAddress: string;
  presentAddress: string;
  phone: string;
  email: string;
  course: CourseCode;
  enrolledOn: string;       // ISO date
  completionDate: string;   // ISO date or ""
  learnerLicenseNo: string;
  learnerLicenseExpiry: string; // ISO date or ""
  drivingLicenseNo: string;
  drivingLicenseIssueDate: string; // ISO date or ""
  advancePayment: string;
  remarks: string;
  status: "In Progress" | "Completed" | "Enrolled";
  progress: number; // 0-100
}

export interface Certificate {
  number: string;
  studentId: string;
  studentName: string;
  course: CourseCode;
  issuedOn: string; // ISO date
  status: "Valid" | "Revoked";
  isReleased?: boolean; // Whether admin has turned ON View & Download for this student
}

export const SCHOOL = {
  name: "BBC Motors Driving School",
  shortName: "BBC Motors",
  location: "Karimganj, Assam",
  licenceNo: "DTK/MDLS/02/2004",
  phones: ["9401773029", "8402026208", "9859137462"],
  email: "info@bbcmotors.in",
  address: "Station Road, Karimganj, Assam 788710",
};

export const COURSES: Course[] = [
  {
    code: "LMV",
    name: "Light Motor Vehicle (LMV)",
    duration: "30 days",
    description: "Cars, jeeps and light vans. Professional practical driving training for personal and commercial road driving.",
    modules: ["Theory Classes", "Road Safety Rules", "Practical Training"],
  },
  {
    code: "MCWG",
    name: "Motorcycle With Gear (MCWG)",
    duration: "15 days",
    description: "Geared two-wheelers, balance, clutch-brake synchronization and city traffic maneuvering.",
    modules: ["Theory Classes", "Road Safety Rules", "Practical Training"],
  },
  {
    code: "MCWOG",
    name: "Motor Cycle Without Gear (MCWOG)",
    duration: "15 days",
    description: "Scooters and non-geared two-wheelers, throttle control, balance, and defensive riding habits.",
    modules: ["Theory Classes", "Road Safety Rules", "Practical Training"],
  },
  {
    code: "HMV",
    name: "Heavy Motor Vehicle (HMV)",
    duration: "45 days",
    description: "Heavy transport vehicles, trucks, buses and commercial carriers with comprehensive road handling.",
    modules: ["Theory Classes", "Road Safety Rules", "Vehicle Maintenance", "Practical Training"],
  },
];

export const STUDENTS: Student[] = [
  {
    id: "STU-1043", name: "Alok Kumar Dey", fatherOrHusbandName: "Ratan Dey", gender: "Male",
    dob: "1998-05-14", bloodGroup: "B+", qualification: "Graduate", occupation: "Private Job",
    permanentAddress: "Ward No 5, Karimganj", presentAddress: "Ward No 5, Karimganj",
    phone: "9435012345", email: "alok.dey@example.com", course: "LMV",
    enrolledOn: "2026-11-12", completionDate: "", learnerLicenseNo: "", learnerLicenseExpiry: "",
    drivingLicenseNo: "", drivingLicenseIssueDate: "", advancePayment: "2000", remarks: "",
    status: "In Progress", progress: 60,
  },
  {
    id: "STU-1042", name: "Rahim Ahmed", fatherOrHusbandName: "Karim Ahmed", gender: "Male",
    dob: "2001-03-20", bloodGroup: "O+", qualification: "12th Pass", occupation: "Student",
    permanentAddress: "Nilambazar, Karimganj", presentAddress: "Nilambazar, Karimganj",
    phone: "9864023456", email: "rahim.a@example.com", course: "MCWG",
    enrolledOn: "2026-11-12", completionDate: "", learnerLicenseNo: "", learnerLicenseExpiry: "",
    drivingLicenseNo: "", drivingLicenseIssueDate: "", advancePayment: "1500", remarks: "",
    status: "Enrolled", progress: 10,
  },
  {
    id: "STU-1041", name: "Priya Baruah", fatherOrHusbandName: "Bikash Baruah", gender: "Female",
    dob: "1995-08-10", bloodGroup: "A+", qualification: "Graduate", occupation: "Homemaker",
    permanentAddress: "Station Road, Karimganj", presentAddress: "Station Road, Karimganj",
    phone: "7002034567", email: "priya.b@example.com", course: "HMV",
    enrolledOn: "2026-11-11", completionDate: "", learnerLicenseNo: "AS09-20250011", learnerLicenseExpiry: "2027-05-10",
    drivingLicenseNo: "", drivingLicenseIssueDate: "", advancePayment: "3000", remarks: "",
    status: "In Progress", progress: 35,
  },
  {
    id: "STU-1040", name: "Suman Sharma", fatherOrHusbandName: "Dinesh Sharma", gender: "Male",
    dob: "1990-12-01", bloodGroup: "AB+", qualification: "10th Pass", occupation: "Business",
    permanentAddress: "Ramnagar, Karimganj", presentAddress: "Ramnagar, Karimganj",
    phone: "9101045678", email: "suman.s@example.com", course: "LMV",
    enrolledOn: "2026-11-10", completionDate: "", learnerLicenseNo: "", learnerLicenseExpiry: "",
    drivingLicenseNo: "", drivingLicenseIssueDate: "", advancePayment: "2000", remarks: "",
    status: "In Progress", progress: 45,
  },
  {
    id: "STU-1039", name: "Nabanita Das", fatherOrHusbandName: "Narayan Das", gender: "Female",
    dob: "1997-07-22", bloodGroup: "B-", qualification: "Graduate", occupation: "Teacher",
    permanentAddress: "Tarapur, Karimganj", presentAddress: "Tarapur, Karimganj",
    phone: "9954056789", email: "nabanita.d@example.com", course: "LMV",
    enrolledOn: "2026-10-02", completionDate: "2026-11-02", learnerLicenseNo: "AS09-20240789", learnerLicenseExpiry: "2026-12-01",
    drivingLicenseNo: "AS09 20261039", drivingLicenseIssueDate: "2026-11-05", advancePayment: "2000", remarks: "",
    status: "Completed", progress: 100,
  },
  {
    id: "STU-1038", name: "Rupam Nath", fatherOrHusbandName: "Dilip Nath", gender: "Male",
    dob: "1993-11-15", bloodGroup: "O-", qualification: "12th Pass", occupation: "Driver",
    permanentAddress: "Badarpur, Karimganj", presentAddress: "Badarpur, Karimganj",
    phone: "8011067890", email: "rupam.n@example.com", course: "MCWG",
    enrolledOn: "2026-09-21", completionDate: "2026-10-06", learnerLicenseNo: "AS09-20231122", learnerLicenseExpiry: "2025-11-01",
    drivingLicenseNo: "AS09 20261038", drivingLicenseIssueDate: "2026-10-10", advancePayment: "1500", remarks: "",
    status: "Completed", progress: 100,
  },
];

export const CERTIFICATES: Certificate[] = [
  { number: "BBC2026/1043", studentId: "STU-1043", studentName: "Alok Kumar Dey", course: "LMV", issuedOn: "2026-11-17", status: "Valid", isReleased: false },
  { number: "BBC2026/1039", studentId: "STU-1039", studentName: "Nabanita Das", course: "LMV", issuedOn: "2026-11-02", status: "Valid", isReleased: true },
  { number: "BBC2026/1038", studentId: "STU-1038", studentName: "Rupam Nath", course: "MCWG", issuedOn: "2026-10-06", status: "Valid", isReleased: true },
  { number: "BBC2025/0877", studentId: "STU-0877", studentName: "Hemanta Saikia", course: "HMV", issuedOn: "2025-06-14", status: "Revoked", isReleased: false },
];

export const DASHBOARD_STATS = [
  { key: "students", label: "Total Students", value: 2482, change: 12 },
  { key: "certificates", label: "Total Certificates", value: 2320, change: 10 },
  { key: "valid", label: "Valid Certificates", value: 2318, change: 99.9 },
  { key: "suspicious", label: "Suspicious Attempts", value: 3, change: -1 },
] as const;

export const CERTIFICATE_TREND = [
  { month: "May", count: 420 },
  { month: "Jun", count: 690 },
  { month: "Jul", count: 790 },
  { month: "Aug", count: 920 },
  { month: "Sep", count: 1010 },
  { month: "Oct", count: 1240 },
];

export const RECENT_REGISTRATIONS = [
  { name: "Alok Kumar Dey", course: "LMV", ago: "2 mins ago" },
  { name: "Rahim Ahmed", course: "MCWG", ago: "5 mins ago" },
  { name: "Priya Baruah", course: "Transport", ago: "12 mins ago" },
  { name: "Suman Sharma", course: "LMV", ago: "15 mins ago" },
];

export const LATEST_ACTIVITY = [
  { kind: "verified", text: "Certificate verified: #BBC2026/1043", ago: "2m ago" },
  { kind: "registered", text: "New student registered: Alok Kumar Dey", ago: "5m ago" },
  { kind: "failed", text: "Payment failed: Rahim Ahmed", ago: "8m ago" },
] as const;

export const VERIFICATION_LOGS = [
  { id: 1, number: "BBC2026/1043", result: "Valid", ip: "103.21.44.10", at: "2026-11-17 10:42" },
  { id: 2, number: "BBC2026/9999", result: "Not Found", ip: "49.36.12.88", at: "2026-11-17 10:15" },
  { id: 3, number: "BBC2025/0877", result: "Revoked", ip: "157.45.3.201", at: "2026-11-16 18:03" },
  { id: 4, number: "BBC2026/1039", result: "Valid", ip: "103.21.44.10", at: "2026-11-16 12:30" },
];

export const PAYMENTS = [
  { id: "PAY-5521", student: "Alok Kumar Dey", amount: 6500, method: "UPI", status: "Paid", date: "2026-11-12" },
  { id: "PAY-5520", student: "Rahim Ahmed", amount: 3000, method: "Card", status: "Failed", date: "2026-11-12" },
  { id: "PAY-5519", student: "Priya Baruah", amount: 12000, method: "Cash", status: "Paid", date: "2026-11-11" },
  { id: "PAY-5518", student: "Suman Sharma", amount: 6500, method: "UPI", status: "Pending", date: "2026-11-10" },
];

export const ANNOUNCEMENTS = [
  { id: 1, title: "Driving test slots open for December", date: "2026-11-15", audience: "All students" },
  { id: 2, title: "Office closed on 25 November", date: "2026-11-10", audience: "All students" },
  { id: 3, title: "New Transport batch starts 1 December", date: "2026-11-05", audience: "Transport" },
];

export function getCourse(code: CourseCode): Course {
  return COURSES.find((c) => c.code === code) ?? COURSES[0]!;
}

export function normalizeCertificateNumber(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}

export type VerificationResult =
  | { status: "valid"; certificate: Certificate }
  | { status: "revoked"; certificate: Certificate }
  | { status: "not_found" }
  | { status: "invalid_format" };

const CERT_PATTERN = /^BBC\d{4}\/\d{4}$/;

export function verifyCertificate(input: string): VerificationResult {
  const number = normalizeCertificateNumber(input);
  if (!CERT_PATTERN.test(number)) return { status: "invalid_format" };
  const certificate = CERTIFICATES.find((c) => c.number === number);
  if (!certificate) return { status: "not_found" };
  return certificate.status === "Valid"
    ? { status: "valid", certificate }
    : { status: "revoked", certificate };
}

export function formatDateDMY(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

export function formatDateLong(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/** The default student fallback. */
export const CURRENT_STUDENT = STUDENTS[0]!;

/** Authenticate student by their 10-digit registered mobile number */
export async function authenticateStudentByPhone(phoneInput: string): Promise<Student | null> {
  const clean = phoneInput.replace(/\D/g, "").slice(-10);
  if (!clean || clean.length < 10) return null;

  if (db) {
    try {
      const q = query(collection(db, "students"), where("phone", "==", clean));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0]!.data() as Student;
      }
    } catch (err) {
      console.warn("Firestore student lookup by phone failed:", err);
    }
  }

  // Fallback to local students list
  const found = STUDENTS.find((s) => s.phone.replace(/\D/g, "").slice(-10) === clean);
  return found ?? null;
}

export function getLoggedInStudent(): Student | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("bbc_active_student");
    if (raw) return JSON.parse(raw) as Student;
  } catch {}
  return null;
}

export function setLoggedInStudent(student: Student): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("bbc_active_student", JSON.stringify(student));
    window.dispatchEvent(new Event("student-session-updated"));
  } catch {}
}

export function logoutStudent(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("bbc_active_student");
    window.dispatchEvent(new Event("student-session-updated"));
  } catch {}
}

export function useCurrentStudent(): { student: Student; loading: boolean } {
  const [student, setStudent] = useState<Student>(() => {
    if (typeof window !== "undefined") {
      const stored = getLoggedInStudent();
      if (stored) return stored;
    }
    return CURRENT_STUDENT;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function sync() {
      const s = getLoggedInStudent();
      if (s) {
        setStudent(s);
      } else {
        setStudent(CURRENT_STUDENT);
      }
    }
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("student-session-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("student-session-updated", sync);
    };
  }, []);

  return { student, loading };
}

/** Async verification against Firestore with local fallback. */
export async function verifyCertificateAsync(input: string): Promise<VerificationResult> {
  const number = normalizeCertificateNumber(input);
  if (!CERT_PATTERN.test(number)) return { status: "invalid_format" };

  if (db) {
    try {
      const q = query(collection(db, "certificates"), where("number", "==", number));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const certData = snap.docs[0]!.data() as Certificate;
        return certData.status === "Valid"
          ? { status: "valid", certificate: certData }
          : { status: "revoked", certificate: certData };
      }
    } catch (err) {
      console.warn("Firestore certificate lookup failed, checking local registry:", err);
    }
  }

  // Fallback to local registry
  return verifyCertificate(input);
}

/** Fetch all students from Firestore, falling back to local list. */
export async function getStudents(): Promise<Student[]> {
  if (!db) return STUDENTS;
  try {
    const snap = await getDocs(collection(db, "students"));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as Student);
    }
  } catch (err) {
    console.warn("Failed to fetch students from Firestore:", err);
  }
  return STUDENTS;
}

/** Fetch all certificates from Firestore, falling back to local list. */
export async function getCertificates(): Promise<Certificate[]> {
  if (!db) return CERTIFICATES;
  try {
    const snap = await getDocs(collection(db, "certificates"));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as Certificate);
    }
  } catch (err) {
    console.warn("Failed to fetch certificates from Firestore:", err);
  }
  return CERTIFICATES;
}

/** Save or update student in Firestore. */
export async function saveStudent(student: Student): Promise<void> {
  if (!db) return;
  const ref = doc(db, "students", student.id);
  await setDoc(ref, student, { merge: true });
}

/** Save or update certificate in Firestore. */
export async function saveCertificate(cert: Certificate): Promise<void> {
  const idx = CERTIFICATES.findIndex((c) => c.number === cert.number);
  if (idx >= 0) {
    CERTIFICATES[idx] = { ...CERTIFICATES[idx]!, ...cert };
  } else {
    CERTIFICATES.push(cert);
  }
  if (!db) return;
  const ref = doc(db, "certificates", cert.number.replace("/", "-"));
  await setDoc(ref, cert, { merge: true });
}

/** Toggle whether student can view and download certificate */
export async function toggleCertificateRelease(certNumber: string, isReleased: boolean): Promise<void> {
  const idx = CERTIFICATES.findIndex((c) => c.number === certNumber);
  if (idx >= 0) {
    CERTIFICATES[idx]!.isReleased = isReleased;
  }
  if (!db) return;
  const ref = doc(db, "certificates", certNumber.replace("/", "-"));
  await setDoc(ref, { isReleased }, { merge: true });
}

/** Live real-time students hook from Firestore */
export function useStudents(): { students: Student[]; loading: boolean } {
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [loading, setLoading] = useState(Boolean(db));

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      collection(db, "students"),
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as Student);
          setStudents(list);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Failed to listen to Firestore students:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { students, loading };
}

/** Live real-time certificates hook from Firestore */
export function useCertificates(): { certificates: Certificate[]; loading: boolean } {
  const [certificates, setCertificates] = useState<Certificate[]>(CERTIFICATES);
  const [loading, setLoading] = useState(Boolean(db));

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      collection(db, "certificates"),
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as Certificate);
          setCertificates(list);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Failed to listen to Firestore certificates:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { certificates, loading };
}

/** Live real-time courses hook from Firestore */
export function useCourses(): { courses: Course[]; loading: boolean } {
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [loading, setLoading] = useState(Boolean(db));

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      collection(db, "courses"),
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as Course);
          setCourses(list);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Failed to listen to Firestore courses:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { courses, loading };
}

/** Live real-time announcements hook from Firestore */
export function useAnnouncements(): { announcements: Array<{ id: string | number; title: string; date: string; audience: string }>; loading: boolean } {
  const [announcements, setAnnouncements] = useState<Array<{ id: string | number; title: string; date: string; audience: string }>>(ANNOUNCEMENTS);
  const [loading, setLoading] = useState(Boolean(db));

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      collection(db, "announcements"),
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as { id: string | number; title: string; date: string; audience: string });
          setAnnouncements(list);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Failed to listen to Firestore announcements:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { announcements, loading };
}

/** Save or update announcement in Firestore */
export async function saveAnnouncement(announcement: { id: string | number; title: string; date: string; audience: string }): Promise<void> {
  if (!db) return;
  const ref = doc(db, "announcements", String(announcement.id));
  await setDoc(ref, announcement, { merge: true });
}

/** Delete student from Firestore */
export async function deleteStudent(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "students", id));
}

/** Delete certificate from Firestore */
export async function deleteCertificate(number: string): Promise<void> {
  if (!db) return;
  const slug = number.replace("/", "-");
  await deleteDoc(doc(db, "certificates", slug));
}
