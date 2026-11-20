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
  photo?: string | undefined;           // Base64 or image URL
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
  amountPaid: string; // Total fee paid by the student
  paymentMethod: "Cash" | "UPI" | "Card" | "Cheque" | "";
  remarks: string;
  status: "In Progress" | "Completed" | "Enrolled";
  progress: number; // 0-100
}

export interface Certificate {
  number: string;
  studentId: string;
  studentName: string;
  photo?: string | undefined;           // Trainee passport photo
  course: CourseCode;
  issuedOn: string; // ISO date
  status: "Valid" | "Revoked";
  isReleased?: boolean; // Whether admin has turned ON View & Download for this student
}

export const SCHOOL = {
  name: "BBC Motor Driving School",
  shortName: "BBC Motor",
  location: "Sribhumi, Assam",
  licenceNo: "DTK/MDLS/02/2004",
  phones: ["9401773029", "6901090154", "9859137426"],
  email: "bbc.drivingschool.sribhumi@gmail.com",
  address: "Silchar Road, Opposite of Senco petrol pump, Sribhumi , Assam - 788713",
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

export const STUDENTS: Student[] = [];

export const CERTIFICATES: Certificate[] = [];

export const DASHBOARD_STATS = [
  { key: "students", label: "Total Students", value: 0, change: 0 },
  { key: "certificates", label: "Total Certificates", value: 0, change: 0 },
  { key: "valid", label: "Valid Certificates", value: 0, change: 0 },
  { key: "suspicious", label: "Suspicious Attempts", value: 0, change: 0 },
] as const;

export const CERTIFICATE_TREND: Array<{ month: string; count: number }> = [];

export const RECENT_REGISTRATIONS: Array<{ name: string; course: string; ago: string }> = [];

export const LATEST_ACTIVITY: Array<{ kind: string; text: string; ago: string }> = [];

export const VERIFICATION_LOGS: Array<{ id: number; number: string; result: "Valid" | "Revoked" | "Not Found"; ip: string; at: string }> = [];

export const PAYMENTS: Array<{ id: string; student: string; amount: number; method: string; status: "Paid" | "Failed" | "Pending"; date: string }> = [];

export const ANNOUNCEMENTS: Array<{ id: string | number; title: string; date: string; audience: string }> = [];

export function getCourse(code: CourseCode): Course {
  return COURSES.find((c) => c.code === code) ?? COURSES[0]!;
}

export function isHeavyVehicleCourse(course: CourseCode): boolean {
  return course === "HMV" || course === "Transport";
}

/**
 * Auto-generates the next enrollment number based on vehicle class:
 * - LMV, MCWG, MCWOG: Starts from 65/26 and increments (65/26, 66/26, ...)
 * - HMV, Transport: Starts from 271/26 and increments (271/26, 272/26, ...)
 */
export function generateNextEnrollmentNo(students: Student[], course: CourseCode): string {
  const isHeavy = isHeavyVehicleCourse(course);
  const currentYearSuffix = String(new Date().getFullYear()).slice(-2); // e.g. "26"
  const baseStart = isHeavy ? 271 : 65;

  const relevantNums: number[] = [];
  for (const s of students) {
    const sHeavy = isHeavyVehicleCourse(s.course);
    if (sHeavy === isHeavy) {
      const parts = s.id.split("/");
      if (parts.length === 2) {
        const seq = parseInt(parts[0]!, 10);
        const yr = parts[1]!.trim();
        if (!isNaN(seq) && (yr === currentYearSuffix || !yr)) {
          relevantNums.push(seq);
        }
      }
    }
  }

  const nextSeq = relevantNums.length > 0 ? Math.max(baseStart, Math.max(...relevantNums) + 1) : baseStart;
  return `${nextSeq}/${currentYearSuffix}`;
}

/**
 * Auto-generates the next certificate number:
 * - HMV, Transport: Starts from BBC2026/271 and increments (BBC2026/271, BBC2026/272, ...)
 * - LMV, MCWG, MCWOG: Starts from BBC2026/157 and increments (BBC2026/157, BBC2026/158, ...)
 */
export function generateNextCertificateNo(certificates: Certificate[], course: CourseCode): string {
  const isHeavy = isHeavyVehicleCourse(course);
  const year = new Date().getFullYear();
  const baseStart = isHeavy ? 271 : 157;

  const relevantNums: number[] = [];
  for (const c of certificates) {
    const cHeavy = isHeavyVehicleCourse(c.course);
    if (cHeavy === isHeavy) {
      const match = c.number.match(/^BBC(\d{4})\/(\d+)$/i);
      if (match && match[1] === String(year)) {
        const seq = parseInt(match[2]!, 10);
        if (!isNaN(seq)) {
          relevantNums.push(seq);
        }
      }
    }
  }

  const nextSeq = relevantNums.length > 0 ? Math.max(baseStart, Math.max(...relevantNums) + 1) : baseStart;
  return `BBC${year}/${nextSeq}`;
}

export function normalizeCertificateNumber(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}

export type VerificationResult =
  | { status: "valid"; certificate: Certificate }
  | { status: "revoked"; certificate: Certificate }
  | { status: "not_found" }
  | { status: "invalid_format" };

const CERT_PATTERN = /^BBC\d{4}\/\d+$/;

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
export const DEFAULT_EMPTY_STUDENT: Student = {
  id: "—",
  name: "Student",
  fatherOrHusbandName: "",
  gender: "Male",
  dob: "",
  bloodGroup: "",
  qualification: "",
  occupation: "",
  permanentAddress: "",
  presentAddress: "",
  phone: "",
  email: "",
  course: "LMV",
  enrolledOn: new Date().toISOString().slice(0, 10),
  completionDate: "",
  learnerLicenseNo: "",
  learnerLicenseExpiry: "",
  drivingLicenseNo: "",
  drivingLicenseIssueDate: "",
  amountPaid: "0",
  paymentMethod: "",
  remarks: "",
  status: "Enrolled",
  progress: 0,
};

export const CURRENT_STUDENT: Student = DEFAULT_EMPTY_STUDENT;

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
  } catch { }
  return null;
}

export function setLoggedInStudent(student: Student): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("bbc_active_student", JSON.stringify(student));
    window.dispatchEvent(new Event("student-session-updated"));
  } catch { }
}

export function logoutStudent(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("bbc_active_student");
    window.dispatchEvent(new Event("student-session-updated"));
  } catch { }
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
        // Refresh from Firestore to fix stale localStorage data
        if (db) {
          import("firebase/firestore").then(({ query, collection, where, getDocs }) => {
            const q = query(collection(db!, "students"), where("phone", "==", s.phone));
            getDocs(q).then((snap) => {
              if (!snap.empty) {
                const fresh = snap.docs[0]!.data() as Student;
                setStudent(fresh);
                setLoggedInStudent(fresh);
              }
            }).catch(() => { });
          }).catch(() => { });
        }
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
    return snap.docs.map((d) => d.data() as Student);
  } catch (err) {
    console.warn("Failed to fetch students from Firestore:", err);
  }
  return [];
}

/** Fetch all certificates from Firestore, falling back to local list. */
export async function getCertificates(): Promise<Certificate[]> {
  if (!db) return CERTIFICATES;
  try {
    const snap = await getDocs(collection(db, "certificates"));
    return snap.docs.map((d) => d.data() as Certificate);
  } catch (err) {
    console.warn("Failed to fetch certificates from Firestore:", err);
  }
  return [];
}

/** Save or update student in Firestore. */
export async function saveStudent(student: Student): Promise<void> {
  const idx = STUDENTS.findIndex((s) => s.id === student.id);
  if (idx >= 0) {
    STUDENTS[idx] = { ...STUDENTS[idx]!, ...student };
  } else {
    STUDENTS.unshift(student);
  }
  if (!db) return;
  const docId = student.id.replace(/\//g, "-");
  const ref = doc(db, "students", docId);
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
        const list = snap.docs.map((d) => d.data() as Student);
        setStudents(list);
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
        const list = snap.docs.map((d) => d.data() as Certificate);
        setCertificates(list);
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
        } else {
          setCourses(COURSES);
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
        const list = snap.docs.map((d) => d.data() as { id: string | number; title: string; date: string; audience: string });
        setAnnouncements(list);
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
  const idx = STUDENTS.findIndex((s) => s.id === id);
  if (idx >= 0) {
    STUDENTS.splice(idx, 1);
  }
  if (!db) return;
  const docId = id.replace(/\//g, "-");
  await deleteDoc(doc(db, "students", docId));
}

/** Delete certificate from Firestore */
export async function deleteCertificate(number: string): Promise<void> {
  const idx = CERTIFICATES.findIndex((c) => c.number === number);
  if (idx >= 0) {
    CERTIFICATES.splice(idx, 1);
  }
  if (!db) return;
  const slug = number.replace(/\//g, "-");
  await deleteDoc(doc(db, "certificates", slug));
}
