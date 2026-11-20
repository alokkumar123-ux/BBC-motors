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

const STUDENTS: any[] = [];

const CERTIFICATES: any[] = [];

const ANNOUNCEMENTS: any[] = [];

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

