import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import {
  type Certificate,
  formatDateDMY,
  getCourse,
  useStudents,
} from "@/lib/school-data";

/**
 * Ornate corner filigree matching official Assam driving school certificates.
 */
function CornerFiligree({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 4 H32 C28 12 24 18 18 24 C12 30 6 36 4 48 Z" />
      <path d="M4 4 V32 C12 28 18 24 24 18 C30 12 36 6 48 4 Z" />
      {/* Intricate floral swirls */}
      <circle cx="16" cy="16" r="6" />
      <path d="M12 28 C18 22 26 24 30 30 C34 36 30 46 22 48 C15 50 10 38 12 28 Z" />
      <path d="M28 12 C22 18 24 26 30 30 C36 34 46 30 48 22 C50 15 38 10 28 12 Z" />
      <path d="M38 38 C48 28 60 30 64 38 C68 46 60 56 50 54 C40 52 32 44 38 38 Z" />
      <circle cx="48" cy="48" r="4.5" />
      <path d="M16 58 C22 52 30 54 32 60 C34 66 28 72 22 70 C16 68 12 62 16 58 Z" />
      <path d="M58 16 C52 22 54 30 60 32 C66 34 72 28 70 22 C68 16 62 12 58 16 Z" />
      <circle cx="68" cy="68" r="5" />
      <path d="M4 72 C8 60 16 52 24 46 C32 40 40 32 46 24 C52 16 60 8 72 4 L68 4 C56 8 48 16 42 24 C36 32 28 40 22 46 C16 52 8 60 4 68 Z" />
    </svg>
  );
}

/**
 * Official circular red seal / rubber stamp of BBC Motor Driving School.
 */
function OfficialSeal({ certNo }: { certNo: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
      <svg
        viewBox="0 0 160 160"
        className="w-28 h-28 sm:w-32 sm:h-32 text-[#B91C1C]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Double Outer Rings */}
        <circle cx="80" cy="80" r="76" stroke="currentColor" strokeWidth="3" />
        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="1.5" />

        {/* Circular text paths */}
        <path
          id="upperSealText"
          d="M 18,80 A 62,62 0 1,1 142,80"
          fill="none"
        />
        <text
          fontSize="11"
          fontWeight="bold"
          fill="currentColor"
          letterSpacing="2.2"
        >
          <textPath href="#upperSealText" startOffset="50%" textAnchor="middle">
            ★ B.B.C. DRIVING SCHOOL ★
          </textPath>
        </text>

        <path
          id="lowerSealText"
          d="M 142,80 A 62,62 0 0,1 18,80"
          fill="none"
        />
        <text
          fontSize="10"
          fontWeight="bold"
          fill="currentColor"
          letterSpacing="2"
        >
          <textPath href="#lowerSealText" startOffset="50%" textAnchor="middle">
            SRIBHUMI / KARIMGANJ (ASSAM)
          </textPath>
        </text>

        {/* Inner Circle with Steering Wheel / Govt Emblem */}
        <circle cx="80" cy="80" r="42" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="80" cy="80" r="36" stroke="currentColor" strokeWidth="1.5" />

        {/* Steering Wheel graphic */}
        <circle cx="80" cy="80" r="10" fill="currentColor" />
        <circle cx="80" cy="80" r="5" fill="#FFFDF8" />
        <line x1="80" y1="44" x2="80" y2="70" stroke="currentColor" strokeWidth="3" />
        <line x1="80" y1="90" x2="80" y2="116" stroke="currentColor" strokeWidth="3" />
        <line x1="44" y1="80" x2="70" y2="80" stroke="currentColor" strokeWidth="3" />
        <line x1="90" y1="80" x2="116" y2="80" stroke="currentColor" strokeWidth="3" />

        {/* Registration Mark */}
        <text x="80" y="70" fontSize="7" fontWeight="bold" textAnchor="middle" fill="currentColor">
          GOVT. REGD
        </text>
        <text x="80" y="96" fontSize="6.5" fontWeight="bold" textAnchor="middle" fill="currentColor">
          ESTD 2004
        </text>
      </svg>
      <span className="text-[10px] font-bold text-[#B91C1C] tracking-widest uppercase mt-0.5">
        Official Seal
      </span>
    </div>
  );
}

export function CertificateDocument({ certificate }: { certificate: Certificate }) {
  const [origin, setOrigin] = useState("");
  const { students } = useStudents();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const course = getCourse(certificate.course);
  const verifyUrl = `${origin || "https://bbcmotors.in"}/verify?no=${encodeURIComponent(certificate.number)}`;

  // Find linked student record to fill all details accurately
  const student = students.find(
    (s) =>
      s.id === certificate.studentId ||
      s.name.toLowerCase() === certificate.studentName.toLowerCase()
  );

  const studentName = student?.name || certificate.studentName || "Sri Alok Kumar Dey";
  const fatherOrHusbandName = student?.fatherOrHusbandName || "Sri Ratan Dey";
  const residingAddress =
    student?.permanentAddress || student?.presentAddress || "Silchar Road, Sribhumi, Assam";
  const dobText = student?.dob ? formatDateDMY(student.dob) : "14-05-1998";
  const enrolledOnText = student?.enrolledOn
    ? formatDateDMY(student.enrolledOn)
    : formatDateDMY(certificate.issuedOn);
  const serialNo =
    student?.id?.replace("STU-", "") ||
    certificate.number.replace(/\D/g, "").slice(-4) ||
    "157";
  const vehicleClass = `${course.name} (${course.code})`;
  const periodFrom = student?.enrolledOn
    ? formatDateDMY(student.enrolledOn)
    : formatDateDMY(certificate.issuedOn);
  const periodTo = student?.completionDate
    ? formatDateDMY(student.completionDate)
    : formatDateDMY(certificate.issuedOn);
  const issuedDate = formatDateDMY(certificate.issuedOn);

  return (
    <div className="print-area relative mx-auto w-full max-w-[800px] bg-[#FFFDF8] text-slate-900 shadow-2xl p-4 sm:p-7 border border-slate-300">
      {/* Outer Red Frame */}
      <div className="relative border-[5px] border-[#B91C1C] p-3 sm:p-5 bg-[#FFFDF8]">
        {/* Inner Thin Red Border */}
        <div className="relative border-2 border-[#B91C1C] px-5 py-6 sm:px-8 sm:py-8 bg-[#FFFDF8]">
          {/* 4 Decorative Corner Ornaments */}
          <CornerFiligree className="absolute top-1 left-1 w-14 h-14 sm:w-16 sm:h-16 text-[#B91C1C] pointer-events-none" />
          <CornerFiligree className="absolute top-1 right-1 w-14 h-14 sm:w-16 sm:h-16 text-[#B91C1C] -scale-x-100 pointer-events-none" />
          <CornerFiligree className="absolute bottom-1 left-1 w-14 h-14 sm:w-16 sm:h-16 text-[#B91C1C] -scale-y-100 pointer-events-none" />
          <CornerFiligree className="absolute bottom-1 right-1 w-14 h-14 sm:w-16 sm:h-16 text-[#B91C1C] -scale-100 pointer-events-none" />

          {/* 1. Header Section */}
          <div className="text-center pt-2 pb-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide text-[#B91C1C] font-serif uppercase leading-tight">
              B.B.C. MOTOR DRIVING SCHOOL
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-bold tracking-wider text-[#B91C1C] uppercase">
              SILCHAR ROAD (NEAR BHAIRABBARI) SRIBHUMI, ASSAM
            </p>
            <p className="mt-0.5 text-xs sm:text-sm font-bold tracking-wider text-[#B91C1C]">
              LICENCE NO. DTK / MDSL / 02 / 2004
            </p>
          </div>

          {/* 2. Certificate No. & Title Box & QR Code */}
          <div className="mt-4 flex items-center justify-between gap-2 border-b-2 border-dashed border-[#B91C1C]/40 pb-4">
            {/* Certificate No */}
            <div className="text-left">
              <span className="text-xs sm:text-sm font-bold text-[#B91C1C] font-serif">
                Certificate No.{" "}
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-slate-900 px-1 border-b border-slate-900">
                {certificate.number}
              </span>
            </div>

            {/* DRIVING CERTIFICATE Box */}
            <div className="border-2 border-[#B91C1C] p-0.5">
              <div className="border border-[#B91C1C] px-4 py-1.5 sm:px-8 sm:py-2 bg-red-50/30">
                <h2 className="text-sm sm:text-xl font-extrabold tracking-widest text-[#B91C1C] font-serif uppercase text-center">
                  DRIVING CERTIFICATE
                </h2>
              </div>
            </div>

            {/* Verification QR Code */}
            <div className="flex flex-col items-center shrink-0">
              <div className="border border-[#B91C1C] p-1 bg-white">
                <QRCodeSVG value={verifyUrl} size={58} level="M" fgColor="#1E293B" />
              </div>
              <span className="text-[9px] font-bold text-[#B91C1C] uppercase mt-0.5 tracking-tighter">
                Scan to Verify
              </span>
            </div>
          </div>

          {/* 3. Certificate Body Text (Exact wording and structure from user photo) */}
          <div className="mt-7 space-y-4 text-xs sm:text-sm text-[#991B1B] font-serif italic leading-relaxed sm:leading-loose">
            {/* Line 1 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="whitespace-nowrap font-bold text-[#B91C1C] not-italic">
                This is to Certify that Sri/Smti./Kumari
              </span>
              <span className="flex-1 min-w-[200px] border-b border-dotted border-slate-700 px-2 font-sans font-bold text-slate-900 not-italic text-sm sm:text-base">
                {studentName}
              </span>
            </div>

            {/* Line 2 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="whitespace-nowrap font-bold text-[#B91C1C] not-italic">
                Son/Daughter/Wife of
              </span>
              <span className="flex-1 min-w-[220px] border-b border-dotted border-slate-700 px-2 font-sans font-semibold text-slate-800 not-italic">
                {fatherOrHusbandName}
              </span>
            </div>

            {/* Line 3 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="whitespace-nowrap font-bold text-[#B91C1C] not-italic">
                residing at
              </span>
              <span className="flex-1 min-w-[220px] border-b border-dotted border-slate-700 px-2 font-sans font-semibold text-slate-800 not-italic">
                {residingAddress}
              </span>
            </div>

            {/* Line 4 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="whitespace-nowrap font-bold text-[#B91C1C] not-italic">
                Date of Birth
              </span>
              <span className="flex-1 min-w-[220px] border-b border-dotted border-slate-700 px-2 font-sans font-semibold text-slate-800 not-italic">
                {dobText}
              </span>
            </div>

            {/* Line 5 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="whitespace-nowrap font-bold text-[#B91C1C] not-italic">
                was enrolled in this School on
              </span>
              <span className="flex-1 min-w-[160px] border-b border-dotted border-slate-700 px-2 font-sans font-semibold text-slate-800 not-italic text-center">
                {enrolledOnText}
              </span>
              <span className="whitespace-nowrap font-bold text-[#B91C1C] not-italic">
                and
              </span>
            </div>

            {/* Line 6 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="whitespace-nowrap font-bold text-[#B91C1C] not-italic">
                his/her name is registered at serial number
              </span>
              <span className="w-24 sm:w-32 border-b border-dotted border-slate-700 px-2 font-mono font-bold text-slate-900 not-italic text-center">
                {serialNo}
              </span>
              <span className="whitespace-nowrap font-bold text-[#B91C1C] not-italic">
                in our Register in Form 14
              </span>
            </div>

            {/* Line 7 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="whitespace-nowrap font-bold text-[#B91C1C] not-italic">
                and that he/she has undergoes the course of training in driving of
              </span>
              <span className="flex-1 min-w-[180px] border-b border-dotted border-slate-700 px-2 font-sans font-bold text-[#164535] not-italic text-center">
                {vehicleClass}
              </span>
            </div>

            {/* Line 8 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="whitespace-nowrap text-[11px] sm:text-xs text-[#991B1B]">
                (mention class of vehicle) according to the syllabus prescribed for a period from
              </span>
              <span className="w-28 sm:w-36 border-b border-dotted border-slate-700 px-2 font-sans font-semibold text-slate-800 not-italic text-center">
                {periodFrom}
              </span>
            </div>

            {/* Line 9 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="whitespace-nowrap font-bold text-[#B91C1C] not-italic">
                to
              </span>
              <span className="w-32 sm:w-44 border-b border-dotted border-slate-700 px-2 font-sans font-semibold text-slate-800 not-italic text-center">
                {periodTo}
              </span>
              <span className="whitespace-nowrap font-bold text-[#B91C1C] not-italic">
                satisfactorily.
              </span>
            </div>

            {/* Line 10: Sense of responsibility declaration */}
            <div className="pt-2 text-center sm:text-left sm:pl-8 font-serif italic text-xs sm:text-sm text-[#7F1D1D]">
              <p>
                I am satisfied with his/her physical fitness and sense of responsibility.
              </p>
            </div>
          </div>

          {/* 4. Bottom Footer: Issued Date, Official Red Seal, Authorised Signature & Rubber Stamp */}
          <div className="mt-10 sm:mt-14 pt-4 border-t border-[#B91C1C]/30 grid grid-cols-3 items-end gap-2 text-xs sm:text-sm">
            {/* Left: Issued Date */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-[#B91C1C] font-serif not-italic">
                  Issued Date
                </span>
                <span className="border-b border-dotted border-slate-700 font-sans font-bold text-slate-900 px-2">
                  {issuedDate}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground pt-1">
                Place: Sribhumi / Karimganj
              </p>
            </div>

            {/* Center: Official Seal */}
            <div className="flex justify-center">
              <OfficialSeal certNo={certificate.number} />
            </div>

            {/* Right: Authorised Signature & Rubber Stamp */}
            <div className="text-right space-y-1">
              {/* Digital Signature representation */}
              <div className="h-8 flex justify-end items-end pr-2">
                <svg
                  viewBox="0 0 140 40"
                  className="h-8 w-28 text-blue-900 stroke-current"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M 8 28 C 20 8, 30 10, 36 24 C 42 34, 52 16, 62 18 C 72 20, 68 32, 80 26 C 92 20, 100 28, 114 20 C 122 16, 130 18, 136 14" />
                </svg>
              </div>

              <div className="border-t border-[#B91C1C]/60 pt-1 font-serif text-[#B91C1C] font-bold">
                Authorised Signature
              </div>

              {/* Rubber Stamp Box (matching user's photo) */}
              <div className="inline-block border border-blue-800/80 bg-blue-50/40 px-2 py-1 text-left text-[10px] text-blue-900 font-sans font-semibold leading-tight mt-1">
                <p>Proprietor / Manager</p>
                <p>B.B.C. Motor Driving School</p>
                <p>Silchar Road, Sribhumi</p>
                <p>Pin-788713</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
