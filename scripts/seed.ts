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
  { id: "65/26", name: "Alok Kumar Dey", phone: "9435012345", email: "alok.dey@example.com", course: "LMV", enrolledOn: "2026-11-12", amountPaid: "3500", paymentMethod: "Cash", status: "In Progress", progress: 60 },
  { id: "66/26", name: "Rahim Ahmed", phone: "9864023456", email: "rahim.a@example.com", course: "MCWG", enrolledOn: "2026-11-12", amountPaid: "1500", paymentMethod: "UPI", status: "Enrolled", progress: 10 },
  { id: "271/26", name: "Priya Baruah", phone: "7002034567", email: "priya.b@example.com", course: "HMV", enrolledOn: "2026-11-11", amountPaid: "4500", paymentMethod: "Cash", status: "In Progress", progress: 35 },
  { id: "67/26", name: "Suman Sharma", phone: "9101045678", email: "suman.s@example.com", course: "LMV", enrolledOn: "2026-11-10", amountPaid: "3000", paymentMethod: "Card", status: "In Progress", progress: 45 },
  { id: "68/26", name: "Nabanita Das", phone: "9954056789", email: "nabanita.d@example.com", course: "LMV", enrolledOn: "2026-10-02", amountPaid: "3500", paymentMethod: "Cash", status: "Completed", progress: 100 },
  { id: "69/26", name: "Rupam Nath", phone: "8011067890", email: "rupam.n@example.com", course: "MCWG", enrolledOn: "2026-09-21", amountPaid: "1500", paymentMethod: "Cash", status: "Completed", progress: 100 },
];

const CERTIFICATES = [
  { number: "BBC2026/157", studentId: "65/26", studentName: "Alok Kumar Dey", course: "LMV", issuedOn: "2026-11-17", status: "Valid", isReleased: true },
  { number: "BBC2026/158", studentId: "68/26", studentName: "Nabanita Das", course: "LMV", issuedOn: "2026-11-02", status: "Valid", isReleased: true },
  { number: "BBC2026/159", studentId: "69/26", studentName: "Rupam Nath", course: "MCWG", issuedOn: "2026-10-06", status: "Valid", isReleased: true },
  { number: "BBC2026/271", studentId: "271/26", studentName: "Priya Baruah", course: "HMV", issuedOn: "2026-11-18", status: "Valid", isReleased: false },
];

const ANNOUNCEMENTS = [
  { id: "ANN-1", title: "Driving test slots open for December", date: "2026-11-15", audience: "All students" },
  { id: "ANN-2", title: "Office closed on 25 November", date: "2026-11-10", audience: "All students" },
  { id: "ANN-3", title: "New HMV batch starts 1 December", date: "2026-11-05", audience: "HMV" },
];

const SCHOOL = {
  name: "BBC Motor Driving School",
  shortName: "BBC Motor",
  location: "Sribhumi, Assam",
  licenceNo: "DTK/MDLS/02/2004",
  phones: ["9401773029", "9859137426", "6901090154"],
  email: "bbc.drivingschool.sribhumi@gmail.com",
  address: "Silchar Road, Opposite of Senco petrol pump, Sribhumi , Assam - 788713",
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
    const docId = s.id.replace(/\//g, "-");
    await setDoc(doc(db, "students", docId), s);
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

