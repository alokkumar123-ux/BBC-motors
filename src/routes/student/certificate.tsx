import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileBadge, Lock, ShieldAlert } from "lucide-react";
import { PageHeading, Panel, StatusPill } from "@/components/portal/PortalShell";
import { formatDateDMY, useCertificates, useCurrentStudent } from "@/lib/school-data";
import { certificateSlug } from "@/lib/certificate-url";

export const Route = createFileRoute("/student/certificate")({
  head: () => ({ meta: [{ title: "My Certificate — BBC Motors Student Portal" }, { name: "description", content: "View and download your certificate." }] }),
  component: StudentCertificatePage,
});

function StudentCertificatePage() {
  const { student } = useCurrentStudent();
  const { certificates } = useCertificates();
  const cert = certificates.find((c) => c.studentId === student.id || c.studentName.toLowerCase() === student.name.toLowerCase());

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeading title="My Certificate" subtitle={`Trainee: ${student.name} · ${student.course}`} />
      <Panel>
        {cert ? (
          cert.isReleased ? (
            /* Admin has turned ON view & download access */
            <div className="flex flex-wrap items-center justify-between gap-5 p-2">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center border border-[#164535]/30 bg-[#EAF1ED] text-[#164535]">
                  <FileBadge className="h-7 w-7 text-[#164535]" />
                </div>
                <div>
                  <p className="font-extrabold text-[#164535] text-base">Driving Training Certificate</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    No. <span className="font-mono font-bold text-slate-800">{cert.number}</span> • Issued {formatDateDMY(cert.issuedOn)}
                  </p>
                  <div className="mt-2"><StatusPill status={cert.status} /></div>
                </div>
              </div>

              <Link
                to="/certificate/$certNo"
                params={{ certNo: certificateSlug(cert.number) }}
                className="inline-flex items-center gap-2 border border-[#C59E53] bg-[#164535] hover:bg-[#0e2c22] px-5 py-2.5 text-xs font-bold text-white transition-colors shadow-xs"
              >
                <Download className="h-4 w-4 text-[#E5C179]" /> View & Download
              </Link>
            </div>
          ) : (
            /* Admin has NOT turned ON view & download yet */
            <div className="border border-amber-200/90 bg-amber-50/60 p-6 space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="grid h-11 w-11 shrink-0 place-items-center bg-amber-100 text-amber-800 border border-amber-300">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#164535]">
                    Certificate Generated · No. {cert.number}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Issued: {formatDateDMY(cert.issuedOn)} · Course: {cert.course}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed max-w-xl">
                View &amp; download access for this certificate has not been unlocked by the school administration yet.
                Once the administrator turns on download access from the BBC Motors admin office panel, your official verified Form 5 certificate will be available to view and download here.
              </p>

              <div className="pt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300">
                  🔒 Awaiting Admin Release / Approval
                </span>
                <span className="text-[11px] text-muted-foreground">
                  (Office helpline: +91 9401773029)
                </span>
              </div>
            </div>
          )
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-slate-700">No certificate issued yet.</p>
            <p>Your official Form 5 driving certificate will appear here once you complete your course modules and pass the test.</p>
          </div>
        )}
      </Panel>
    </div>
  );
}
