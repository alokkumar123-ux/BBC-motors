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
    <div className="min-h-screen bg-muted py-6">
      <div className="no-print mx-auto mb-4 flex max-w-[860px] items-center gap-2 px-4">
        <button
          onClick={() => router.history.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm font-semibold hover:bg-accent"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm font-semibold hover:bg-accent"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>
      <div className="px-4">
        <CertificateDocument certificate={certificate} />
      </div>
    </div>
  );
}
