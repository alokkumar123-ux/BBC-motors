import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzfStRidwuP_WLKBOgyW_T81hpPI24Z-o",
  authDomain: "bbcmotors.firebaseapp.com",
  projectId: "bbcmotors",
  storageBucket: "bbcmotors.firebasestorage.app",
  messagingSenderId: "647938049215",
  appId: "1:647938049215:web:b4129167c89b20518a720a",
  measurementId: "G-DNKBH5TL57",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COURSES = [
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

const STUDENTS = [
  { id: "STU-1043", name: "Karan Bose", phone: "9435012345", email: "karan.bose@example.com", course: "LMV", enrolledOn: "2026-11-12", status: "In Progress", progress: 60 },
  { id: "STU-1042", name: "Rahim Ahmed", phone: "9864023456", email: "rahim.a@example.com", course: "MCWG", enrolledOn: "2026-11-12", status: "Enrolled", progress: 10 },
  { id: "STU-1041", name: "Priya Baruah", phone: "7002034567", email: "priya.b@example.com", course: "HMV", enrolledOn: "2026-11-11", status: "In Progress", progress: 35 },
  { id: "STU-1040", name: "Suman Sharma", phone: "9101045678", email: "suman.s@example.com", course: "LMV", enrolledOn: "2026-11-10", status: "In Progress", progress: 45 },
  { id: "STU-1039", name: "Nabanita Das", phone: "9954056789", email: "nabanita.d@example.com", course: "LMV", enrolledOn: "2026-10-02", status: "Completed", progress: 100 },
  { id: "STU-1038", name: "Rupam Nath", phone: "8011067890", email: "rupam.n@example.com", course: "MCWG", enrolledOn: "2026-09-21", status: "Completed", progress: 100 },
];

const CERTIFICATES = [
  { number: "BBC2026/1043", studentId: "STU-1043", studentName: "Karan Bose", course: "LMV", issuedOn: "2026-11-17", status: "Valid" },
  { number: "BBC2026/1039", studentId: "STU-1039", studentName: "Nabanita Das", course: "LMV", issuedOn: "2026-11-02", status: "Valid" },
  { number: "BBC2026/1038", studentId: "STU-1038", studentName: "Rupam Nath", course: "MCWG", issuedOn: "2026-10-06", status: "Valid" },
  { number: "BBC2025/0877", studentId: "STU-0877", studentName: "Hemanta Saikia", course: "HMV", issuedOn: "2025-06-14", status: "Revoked" },
];

const ANNOUNCEMENTS = [
  { id: "ANN-1", title: "Driving test slots open for December", date: "2026-11-15", audience: "All students" },
  { id: "ANN-2", title: "Office closed on 25 November", date: "2026-11-10", audience: "All students" },
  { id: "ANN-3", title: "New HMV batch starts 1 December", date: "2026-11-05", audience: "HMV" },
];

const SCHOOL = {
  name: "BBC Motors Driving School",
  shortName: "BBC Motors",
  location: "Karimganj, Assam",
  licenceNo: "DTK/MDLS/02/2004",
  phones: ["9401773029", "8402026208", "9859137462"],
  email: "info@bbcmotors.in",
  address: "Station Road, Karimganj, Assam 788710",
};

async function seed() {
  console.log("Connecting to Firestore bbcmotors...");

  // 1. Seed School metadata
  await setDoc(doc(db, "school", "info"), SCHOOL);
  console.log("✓ Uploaded School Info");

  // 2. Seed Courses
  for (const c of COURSES) {
    await setDoc(doc(db, "courses", c.code), c);
    console.log(`✓ Uploaded Course: ${c.code}`);
  }

  // 3. Seed Students
  for (const s of STUDENTS) {
    await setDoc(doc(db, "students", s.id), s);
    console.log(`✓ Uploaded Student: ${s.name} (${s.id})`);
  }

  // 4. Seed Certificates
  for (const cert of CERTIFICATES) {
    const slug = cert.number.replace("/", "-");
    await setDoc(doc(db, "certificates", slug), cert);
    console.log(`✓ Uploaded Certificate: ${cert.number}`);
  }

  // 5. Seed Announcements
  for (const a of ANNOUNCEMENTS) {
    await setDoc(doc(db, "announcements", a.id), a);
    console.log(`✓ Uploaded Announcement: ${a.title}`);
  }

  console.log("\nAll data uploaded successfully to Firestore database 'bbcmotors'!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

