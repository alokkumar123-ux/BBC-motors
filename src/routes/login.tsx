import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, CheckCircle2, Lock, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Emblem } from "@/components/site/Emblem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authenticateStudentByPhone, setLoggedInStudent } from "@/lib/school-data";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Student Login — BBC Motors Driving School" },
      { name: "description", content: "Sign in to the BBC Motors student portal with your registered mobile number." },
      { property: "og:title", content: "Student Login — BBC Motors" },
      { property: "og:description", content: "Access your driving course progress and digital certificate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [confirmMobile, setConfirmMobile] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const clean1 = mobile.replace(/\D/g, "").slice(-10);
    const clean2 = confirmMobile.replace(/\D/g, "").slice(-10);

    if (!clean1 || clean1.length !== 10) {
      setError("Please enter a valid 10-digit mobile number in the first field.");
      return;
    }

    if (!clean2 || clean2.length !== 10) {
      setError("Please enter your 10-digit mobile number in the second field as well.");
      return;
    }

    if (clean1 !== clean2) {
      setError("Mobile numbers do not match. Please enter the exact same mobile number in both fields to unlock.");
      return;
    }

    setLoading(true);

    try {
      const student = await authenticateStudentByPhone(clean1);
      if (!student) {
        setError(
          `No enrolled student found with mobile number "${clean1}". Please verify your number or contact BBC Motors office at +91 9401773029.`
        );
        setLoading(false);
        return;
      }

      // Save student session in localStorage
      setLoggedInStudent(student);
      toast.success(`Welcome back, ${student.name}! Dashboard unlocked.`);
      navigate({ to: "/student" });
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-[#F5F4EF]">
      {/* Left Branding Column */}
      <div className="hidden flex-col justify-between bg-[#164535] p-12 text-white lg:flex relative overflow-hidden">
        {/* Subtle decorative background accent */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#C59E53]/10 pointer-events-none" />

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <Emblem className="h-12 w-12" />
          <div className="leading-tight">
            <span className="text-lg font-bold block">BBC Motors Driving School</span>
            <span className="text-xs text-[#C59E53] font-medium">Govt. Authorized · Karimganj, Assam</span>
          </div>
        </Link>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 border border-[#C59E53]/40 bg-[#0E2C22] px-3 py-1 text-xs font-semibold text-[#E5C179]">
            <ShieldCheck className="h-4 w-4 text-[#C59E53]" />
            <span>Official Student Portal</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Drive Safe. Drive Smart.
            <br />
            Drive Confident.
          </h1>
          <p className="max-w-md text-sm text-slate-300 leading-relaxed">
            Track your course progress, attendance, practical road sessions, and view your verified Govt. Form 5 driving certificate online.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-4 text-xs text-slate-400 flex justify-between items-center">
          <span>Licence: DTK/MDLS/02/2004</span>
          <span>Helpline: +91 9401773029</span>
        </div>
      </div>

      {/* Right Login Column */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white border border-slate-200 p-8 sm:p-10 shadow-md">
          {/* Mobile Logo for small screens */}
          <Link to="/" className="mb-6 flex items-center gap-3 lg:hidden">
            <span className="bg-[#164535] p-1.5 text-white">
              <Emblem className="h-8 w-8" />
            </span>
            <div>
              <span className="font-bold text-sm block text-[#164535]">BBC Motors</span>
              <span className="text-[11px] text-muted-foreground">Driving School</span>
            </div>
          </Link>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#164535]">
              Student Login
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your registered mobile number in both fields to unlock your student dashboard.
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2.5 border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Field 1: Mobile Number */}
            <div className="space-y-1.5">
              <Label htmlFor="mobile" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Registered Mobile Number *
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(val);
                    if (error) setError(null);
                  }}
                  placeholder="Enter 10-digit mobile number"
                  className="pl-9 h-11 rounded-none border-slate-300 focus:border-[#164535] focus:ring-1 focus:ring-[#164535] text-sm font-medium tracking-wide"
                />
              </div>
            </div>

            {/* Field 2: Confirm Mobile Number */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmMobile" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Password *
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="confirmMobile"
                  name="confirmMobile"
                  type="tel"
                  required
                  maxLength={10}
                  value={confirmMobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setConfirmMobile(val);
                    if (error) setError(null);
                  }}
                  placeholder="Password"
                  className="pl-9 h-11 rounded-none border-slate-300 focus:border-[#164535] focus:ring-1 focus:ring-[#164535] text-sm font-medium tracking-wide"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-[#164535] hover:bg-[#0e2c22] text-white font-bold rounded-none border border-[#C59E53] shadow-sm transition-colors text-sm"
              >
                {loading ? "Verifying Mobile Number..." : "Unlock Student Dashboard"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4 text-[#E5C179]" />}
              </Button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-4 text-center">
            <p className="text-[11px] text-muted-foreground">
              Need admission help? Call BBC Motors office at{" "}
              <a href="tel:9401773029" className="font-semibold text-[#164535] hover:underline">
                +91 9401773029
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
