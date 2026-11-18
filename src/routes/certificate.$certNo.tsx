import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { CertificateDocument } from "@/components/certificate/CertificateDocument";
import { CERTIFICATES, verifyCertificateAsync } from "@/lib/school-data";
import { certificateNumberFromSlug } from "@/lib/certificate-url";

export const Route = createFileRoute("/certificate/$certNo")({
  loader: async ({ params }) => {
    const number = certificateNumberFromSlug(params.certNo);
    const result = await verifyCertificateAsync(number);
    if (result.status === "valid" || result.status === "revoked") {
      return { certificate: result.certificate };
    }
    const fallback = CERTIFICATES.find((c) => c.number === number);
    if (!fallback) throw notFound();
    return { certificate: fallback };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Certificate ${loaderData?.certificate.number ?? ""} — BBC Motors Driving School` },
      { name: "description", content: `Driving training certificate issued to ${loaderData?.certificate.studentName ?? "a student"}.` },
      { property: "og:title", content: `Driving Training Certificate — ${loaderData?.certificate.studentName ?? ""}` },
      { property: "og:description", content: "Issued by BBC Motor Driving School, Karimganj. Verify online." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Certificate not found</h1>
        <Link to="/verify" className="mt-4 inline-block font-semibold text-brand hover:underline">
          Verify a certificate
        </Link>
      </div>
    </div>
  ),
  component: CertificatePage,
});

function CertificatePage() {
  const { certificate } = Route.useLoaderData();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-muted/60 py-6">
      <div className="no-print mx-auto mb-4 flex max-w-[800px] items-center gap-2 px-4">
        <button
          onClick={() => router.history.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#164535] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-none border border-[#164535] bg-[#164535] px-4 py-2 text-xs font-bold text-white hover:bg-[#0e2c22] shadow-xs"
          >
            <Download className="h-4 w-4 text-[#E5C179]" /> Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-none border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 shadow-xs"
          >
            <Printer className="h-4 w-4 text-slate-600" /> Print
          </button>
        </div>
      </div>
      <div className="px-4 pb-12">
        <CertificateDocument certificate={certificate} />
      </div>
    </div>
  );
}
