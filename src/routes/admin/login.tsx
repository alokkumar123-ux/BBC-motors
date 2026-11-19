import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, LogIn, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Emblem } from "@/components/site/Emblem";
import { authenticateAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — BBC Motors" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ok = await authenticateAdmin(userId.trim(), password);
      if (ok) {
        toast.success("Welcome back, Admin!");
        navigate({ to: "/admin" });
      } else {
        setError("Invalid User ID or Password.");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "h-10 w-full border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#164535] rounded-none";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F4EF] px-4">
      {/* Card */}
      <div className="w-full max-w-sm border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="border-b border-border bg-[#164535] px-6 py-5 text-center text-white">
          <div className="flex justify-center">
            <Emblem className="h-12 w-12" />
          </div>
          <p className="mt-2 text-base font-extrabold tracking-tight">BBC Motors Driving School</p>
          <p className="text-xs text-white/70">Admin Panel — Restricted Access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              User ID
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={`${inputCls} pl-9`}
                placeholder="Enter admin user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={`${inputCls} pl-9 pr-10`}
                type={showPass ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-none border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 bg-[#164535] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0e2c22] disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse">Verifying…</span>
            ) : (
              <>
                <LogIn className="h-4 w-4" /> Sign In to Admin Panel
              </>
            )}
          </button>
        </form>

        <p className="border-t border-border px-6 py-3 text-center text-[11px] text-muted-foreground">
          Authorised staff only · DTK/MDLS/02/2004
        </p>
      </div>
    </div>
  );
}
