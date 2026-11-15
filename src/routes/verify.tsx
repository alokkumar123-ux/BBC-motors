import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatDateDMY,
  getCourse,
  verifyCertificateAsync,
  type VerificationResult,
} from "@/lib/school-data";
import { certificateSlug } from "@/lib/certificate-url";

export const Route = createFileRoute("/verify")({
  validateSearch: (search: Record<string, unknown>): { no?: string } =>
    typeof search["no"] === "string" && search["no"] ? { no: search["no"] } : {},
  head: () => ({
    meta: [
      { title: "Verify Certificate — BBC Motors Driving School" },
      {
        name: "description",
        content: "Enter a certificate number to confirm a BBC Motors driving training certificate is genuine.",
      },
      { property: "og:title", content: "Verify a BBC Motors Certificate" },
      { property: "og:description", content: "Check any BBC Motors driving certificate online in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { no } = Route.useSearch();
  const navigate = useNavigate({ from: "/verify" });
  const [value, setValue] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(no ?? "");
    if (!no) {
      setResult(null);
      return;
    }
    setLoading(true);
    verifyCertificateAsync(no)
      .then((res) => setResult(res))
      .catch(() => setResult({ status: "not_found" }))
      .finally(() => setLoading(false));
  }, [no]);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-background px-4 py-16">
        <div className="relative z-10 mx-auto max-w-xl border border-border bg-card p-6 text-center shadow-md sm:p-10">
          <div className="mx-auto grid h-14 w-14 place-items-center bg-[#EAF1ED] text-[#164535]">
            <ShieldCheck className="h-8 w-8 text-[#164535]" strokeWidth={2} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#164535] sm:text-3xl">
            Certificate Verification
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter Certificate Number to verify authenticity against the database
          </p>

          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ search: value.trim() ? { no: value.trim() } : {} });
            }}
          >
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter Certificate No. (e.g. BBC2026/1043)"
              aria-label="Certificate number"
              className="h-11"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full text-base bg-[#164535] hover:bg-[#0e2c22] text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                "Verify Authenticity"
              )}
            </Button>
          </form>

          {result?.status === "valid" && (
            <div className="mt-6 flex items-start gap-5 border border-emerald-300 bg-emerald-50 p-5 text-left text-slate-800">
              <CheckCircle2 className="h-12 w-12 shrink-0 text-emerald-600 mt-0.5" strokeWidth={1.8} />
              <div className="min-w-0">
                <p className="text-lg font-bold text-emerald-900">Certificate is Officially Valid</p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs sm:text-sm">
                  <dt className="font-semibold text-slate-600">Student Name</dt>
                  <dd>: {result.certificate.studentName}</dd>
                  <dt className="font-semibold text-slate-600">Course</dt>
                  <dd>: {getCourse(result.certificate.course).name}</dd>
                  <dt className="font-semibold text-slate-600">Issue Date</dt>
                  <dd>: {formatDateDMY(result.certificate.issuedOn)}</dd>
                  <dt className="font-semibold text-slate-600">Certificate No</dt>
                  <dd>: {result.certificate.number}</dd>
                </dl>
                <Link
                  to="/certificate/$certNo"
                  params={{ certNo: certificateSlug(result.certificate.number) }}
                  className="mt-3 inline-block text-xs sm:text-sm font-semibold text-[#164535] hover:underline"
                >
                  View digital certificate →
                </Link>
              </div>
            </div>
          )}

          {result?.status === "revoked" && (
            <ResultBox tone="warning" title="Certificate has been revoked">
              Certificate {result.certificate.number} is marked as revoked. Please contact the school office.
            </ResultBox>
          )}

          {result?.status === "not_found" && (
            <ResultBox tone="error" title="Certificate not found">
              No certificate matches this number in the database. Please check the spelling or contact BBC Motors.
            </ResultBox>
          )}

          {result?.status === "invalid_format" && (
            <ResultBox tone="error" title="Invalid certificate format">
              Certificate numbers must match the standard format (e.g. BBC2026/1043).
            </ResultBox>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function ResultBox({ tone, title, children }: { tone: "warning" | "error"; title: string; children: React.ReactNode }) {
  const Icon = tone === "warning" ? AlertTriangle : XCircle;
  return (
    <div
      className={
        "mt-6 flex items-start gap-4 border p-5 text-left " +
        (tone === "warning" ? "border-amber-300 bg-amber-50 text-amber-950" : "border-rose-300 bg-rose-50 text-rose-950")
      }
    >
      <Icon className={"h-7 w-7 shrink-0 " + (tone === "warning" ? "text-amber-600" : "text-rose-600")} />
      <div>
        <p className="font-bold text-sm sm:text-base">{title}</p>
        <p className="mt-0.5 text-xs sm:text-sm opacity-90">{children}</p>
      </div>
    </div>
  );
}
