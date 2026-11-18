import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { CheckCircle, ShieldCheck, User } from "lucide-react";
import { Emblem } from "@/components/site/Emblem";
import {
  type Certificate,
  formatDateDMY,
  getCourse,
  useStudents,
} from "@/lib/school-data";

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
    student?.permanentAddress || student?.presentAddress || "Silchar Road, Sribhumi, Assam 788713";
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
  const photoUrl = student?.photo || certificate.photo;

  return (
    <div className="print-area relative mx-auto w-full max-w-[760px] bg-[#FAF9F5] text-slate-800 shadow-2xl p-4 sm:p-6 print:p-0 border border-[#E2DFD5] print:border-none">
      {/* Outer Executive Double Border with Gold and Forest Green Accents */}
      <div className="relative border-[3px] border-[#164535] p-1.5 print:p-1 bg-[#FAF9F5]">
        <div className="relative border-2 border-[#C59E53] p-4 sm:p-5 print:p-3.5 bg-[#FAF9F5]">

          {/* Geometric Corner Accents */}
          <div className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-[#164535] border border-[#C59E53]" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#164535] border border-[#C59E53]" />
          <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 bg-[#164535] border border-[#C59E53]" />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#164535] border border-[#C59E53]" />

          {/* ══════════════════════════════════════════════════════════
              1. GRAND CENTERED HEADER (Single page calibrated)
             ══════════════════════════════════════════════════════════ */}
          <div className="text-center pb-2.5 print:pb-2 border-b-2 border-[#C59E53]/60">
            {/* Top Govt Emblem & Eyebrow */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="grid h-8 w-8 place-items-center bg-[#164535] p-1 text-white border border-[#C59E53]">
                <Emblem className="h-full w-full" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#164535] uppercase leading-tight">
                  Govt. Authorized Motor Driving Training Institute
                </p>
                <p className="text-[9.5px] text-muted-foreground leading-tight">
                  Transport Department · Government of Assam
                </p>
              </div>
            </div>

            {/* School Name on One Commanding Line */}
            <h1 className="text-xl sm:text-2xl print:text-2xl font-black tracking-tight text-[#164535] font-serif uppercase leading-tight mt-0.5">
              B.B.C. MOTOR DRIVING SCHOOL
            </h1>

            {/* Address */}
            <p className="mt-0.5 text-[11px] sm:text-xs font-bold tracking-wider text-slate-700 uppercase">
              Silchar Road, Opposite of Senco petrol pump, Sribhumi , Assam - 788713
            </p>

            {/* Government Licence Badge */}
            <div className="mt-1 inline-flex items-center gap-1.5 bg-[#EAF1ED] border border-[#164535]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#164535]">
              <ShieldCheck className="h-3 w-3 text-[#164535]" />
              <span>LICENCE NO. DTK / MDSL / 02 / 2004</span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              2. SUB-HEADER: TITLE, NUMBERS & PASSPORT PHOTO
             ══════════════════════════════════════════════════════════ */}
          <div className="mt-2.5 print:mt-2 grid grid-cols-[1fr_auto] items-center gap-3 bg-[#F2F0E6] p-2.5 sm:p-3 print:p-2 border border-[#E2DFD5]">
            {/* Left: Certificate Details & QR */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* QR Code */}
              <div className="flex flex-col items-center shrink-0">
                <div className="border border-[#164535] p-0.5 bg-white shadow-xs">
                  <QRCodeSVG value={verifyUrl} size={46} level="M" fgColor="#164535" />
                </div>
                <span className="text-[7.5px] font-bold text-[#164535] tracking-wider uppercase mt-0.5">
                  Scan to Verify
                </span>
              </div>

              {/* Title & Numbers */}
              <div className="space-y-0.5">
                <div className="inline-block border-2 border-[#164535] px-2.5 py-0.5 bg-[#164535] text-white">
                  <h2 className="text-xs sm:text-sm font-extrabold tracking-widest font-serif uppercase">
                    DRIVING CERTIFICATE
                  </h2>
                </div>
                <div className="text-[11px] text-slate-700 space-y-0.5 pt-0.5">
                  <p>
                    Certificate No: <strong className="font-mono text-[#164535]">{certificate.number}</strong>
                  </p>
                  <p>
                    Form 14 Serial: <strong className="font-mono text-[#164535]">{serialNo}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Trainee Passport Photograph Box */}
            <div className="flex items-center justify-end">
              <div className="relative w-20 h-24 sm:w-22 sm:h-26 print:w-20 print:h-24 border-2 border-[#164535] bg-white shadow-sm p-0.5">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={studentName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-1">
                    <User className="h-6 w-6 text-slate-300" />
                    <span className="text-[8px] font-semibold text-slate-500 uppercase mt-0.5 text-center">
                      Passport Photo
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -left-1 bg-[#164535] text-white text-[7.5px] font-bold px-1 py-0.2 border border-[#C59E53] tracking-wider">
                  VERIFIED
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              3. CERTIFICATE BODY TEXT (Compact & Fits on 1 Page)
             ══════════════════════════════════════════════════════════ */}
          <div className="mt-3.5 print:mt-2.5 space-y-2 sm:space-y-2.5 print:space-y-1.5 text-xs sm:text-[13px] print:text-xs text-slate-800 leading-normal sm:leading-relaxed print:leading-normal font-serif">
            {/* Line 1 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-bold text-[#164535]">
                This is to Certify that Sri / Smti. / Kumari
              </span>
              <span className="flex-1 min-w-[200px] border-b-2 border-[#C59E53] pb-0.5 font-sans font-extrabold text-[#164535] text-sm tracking-wide">
                {studentName}
              </span>
            </div>

            {/* Line 2 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-bold text-[#164535]">
                Son / Daughter / Wife of
              </span>
              <span className="flex-1 min-w-[200px] border-b border-slate-400 pb-0.5 font-sans font-bold text-slate-900">
                {fatherOrHusbandName}
              </span>
            </div>

            {/* Line 3 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-bold text-[#164535]">
                residing at
              </span>
              <span className="flex-1 min-w-[220px] border-b border-slate-400 pb-0.5 font-sans font-medium text-slate-800">
                {residingAddress}
              </span>
            </div>

            {/* Line 4 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-bold text-[#164535]">
                Date of Birth
              </span>
              <span className="w-32 sm:w-40 border-b border-slate-400 pb-0.5 font-sans font-semibold text-slate-900">
                {dobText}
              </span>
            </div>

            {/* Line 5 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-bold text-[#164535]">
                was enrolled in this School on
              </span>
              <span className="w-32 sm:w-36 border-b border-slate-400 pb-0.5 font-sans font-semibold text-slate-900 text-center">
                {enrolledOnText}
              </span>
              <span className="font-bold text-[#164535]">
                and
              </span>
            </div>

            {/* Line 6 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-bold text-[#164535]">
                his / her name is registered at serial number
              </span>
              <span className="w-20 sm:w-28 border-b-2 border-[#C59E53] pb-0.5 font-mono font-bold text-[#164535] text-center">
                {serialNo}
              </span>
              <span className="font-bold text-[#164535]">
                in our Register in Form 14
              </span>
            </div>

            {/* Line 7 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-bold text-[#164535]">
                and that he / she has undergone the course of training in driving of
              </span>
              <span className="flex-1 min-w-[180px] border-b-2 border-[#164535] pb-0.5 font-sans font-black text-[#164535] text-sm">
                {vehicleClass}
              </span>
            </div>

            {/* Line 8 & 9 */}
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="text-slate-600">
                (mention class of vehicle) according to the syllabus prescribed for a period from
              </span>
              <span className="w-28 sm:w-32 border-b border-slate-400 pb-0.5 font-sans font-semibold text-slate-900 text-center">
                {periodFrom}
              </span>
              <span className="font-bold text-[#164535]">
                to
              </span>
              <span className="w-28 sm:w-32 border-b border-slate-400 pb-0.5 font-sans font-semibold text-slate-900 text-center">
                {periodTo}
              </span>
              <span className="font-bold text-[#164535]">
                satisfactorily.
              </span>
            </div>

            {/* Line 10: Fitness and responsibility guarantee */}
            <div className="mt-2.5 print:mt-1.5 border-l-4 border-[#C59E53] bg-[#F5F4EF] p-2 text-xs print:text-[11px] font-sans italic text-slate-700">
              <p>
                “I am satisfied with his / her physical fitness and sense of responsibility.”
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              4. BOTTOM AUTHENTICATION & SIGNATURES (Single page height)
             ══════════════════════════════════════════════════════════ */}
          <div className="mt-4 sm:mt-5 print:mt-3 pt-3 border-t-2 border-[#C59E53]/40 flex flex-wrap items-end justify-between gap-4 text-xs">
            {/* Left: Issue Details */}
            <div className="space-y-1">
              <div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Date of Issue</p>
                <p className="font-sans font-bold text-slate-900 text-xs sm:text-sm">{issuedDate}</p>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Place: Sribhumi / Karimganj, Assam
              </p>
              <div className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5">
                <CheckCircle className="h-3 w-3 text-emerald-600" />
                <span>Verified Official Document</span>
              </div>
            </div>

            {/* Right: Authorised Signature & Rubber Stamp */}
            <div className="text-right space-y-1">
              {/* Signature Graphic Area */}
              <div className="h-7 flex justify-end items-end pr-1">
                <svg
                  viewBox="0 0 140 40"
                  className="h-7 w-24 text-blue-900 stroke-current"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M 8 28 C 20 8, 30 10, 36 24 C 42 34, 52 16, 62 18 C 72 20, 68 32, 80 26 C 92 20, 100 28, 114 20 C 122 16, 130 18, 136 14" />
                </svg>
              </div>

              <div className="border-t border-[#164535]/50 pt-0.5 font-serif text-[#164535] font-bold text-[11px]">
                Authorised Signature
              </div>

              {/* Rubber Stamp Box */}
              <div className="inline-block border border-blue-900 bg-blue-50/60 p-1.5 text-left text-[9.5px] font-sans font-semibold text-blue-900 leading-tight">
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
