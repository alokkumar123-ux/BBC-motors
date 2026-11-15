import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { Emblem } from "@/components/site/Emblem";
import { type Certificate, SCHOOL, formatDateDMY, getCourse } from "@/lib/school-data";

export function CertificateDocument({ certificate }: { certificate: Certificate }) {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const course = getCourse(certificate.course);
  const verifyUrl = `${origin}/verify?no=${encodeURIComponent(certificate.number)}`;

  return (
    <div className="print-area cert-border relative mx-auto w-full max-w-[860px] bg-cert-paper text-cert-ink shadow-card">
      <div className="m-2 border-2 border-cert-gold/70 px-6 py-8 sm:px-10">
        <div className="flex items-start gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-navy p-2">
            <Emblem className="h-full w-full" />
          </div>
          <div className="flex-1 text-center">
            <h1 className="font-certificate text-2xl font-extrabold tracking-wide text-cert-red sm:text-3xl">
              BBC MOTOR DRIVING SCHOOL
            </h1>
            <p className="mt-1 font-bengali text-xl font-bold sm:text-2xl">অসম চৰকাৰৰ অনুমোদিত</p>
          </div>
          <div className="shrink-0 bg-card p-1.5">
            <QRCodeSVG value={verifyUrl} size={76} level="M" />
          </div>
        </div>

        <div className="mt-4 text-center text-sm font-semibold sm:text-base">
          <p>Licence No.{SCHOOL.licenceNo}</p>
          <p>(M) {SCHOOL.phones.join(" / ")}</p>
        </div>

        <div className="relative mx-auto mt-5 w-fit">
          <div className="bg-cert-red px-8 py-2 font-certificate text-lg font-bold tracking-wider text-primary-foreground sm:text-2xl [clip-path:polygon(4%_0,96%_0,100%_50%,96%_100%,4%_100%,0_50%)]">
            DRIVING TRAINING CERTIFICATE
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-base">This is to certify that</p>
          <p className="mt-2 text-3xl font-extrabold">{certificate.studentName}</p>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed">
            has successfully completed the driving training program for {course.name} at BBC Motor Driving School.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 text-sm">
          <div className="space-y-1 font-semibold">
            <p>Date of Issue : {formatDateDMY(certificate.issuedOn)}</p>
            <p>Certificate No : {certificate.number}</p>
          </div>
          <div className="text-center">
            <svg viewBox="0 0 120 40" className="mx-auto h-10 w-28 stroke-cert-ink" fill="none" strokeWidth="1.6" aria-hidden>
              <path d="M6 30 C18 6 26 6 24 22 C22 34 34 14 44 18 C52 22 46 32 58 24 C70 16 74 30 86 22 C94 16 104 18 114 14" />
            </svg>
            <p className="border-t border-cert-ink/40 pt-1 font-semibold">Authorized Signatory</p>
            <p className="font-semibold">BBC Motor Driving School</p>
          </div>
        </div>
      </div>
    </div>
  );
}
