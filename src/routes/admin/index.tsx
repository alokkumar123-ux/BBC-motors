import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Car, FilePlus2, IndianRupee, Megaphone, ShieldCheck, TrendingUp, UserCheck, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Panel } from "@/components/portal/PortalShell";
import { COURSES, initials, useStudents, useCertificates } from "@/lib/school-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — BBC Motors Admin" },
      { name: "description", content: "Overview of students, courses and school activity." },
      { property: "og:title", content: "BBC Motors Admin Dashboard" },
      { property: "og:description", content: "Students, courses and admissions at a glance." },
    ],
  }),
  component: AdminDashboard,
});

const AVATAR_TONES = [
  "bg-brand-soft text-[#164535]",
  "bg-amber-100 text-[#C59E53]",
  "bg-emerald-100 text-emerald-800",
  "bg-blue-100 text-blue-800",
];

function AdminDashboard() {
  const { students } = useStudents();
  const { certificates } = useCertificates();
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
  }, []);

  const inTrainingCount = students.filter((s) => s.status === "In Progress").length;
  const newEnrolledCount = students.filter((s) => s.status === "Enrolled").length;
  const completedCount = students.filter((s) => s.status === "Completed").length;

  // Earnings analytics
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  // Count how many students enrolled this month / this year (as a proxy for new fee intake)
  const enrolledThisMonth = students.filter((s) => {
    const d = new Date(s.enrolledOn);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const enrolledThisYear = students.filter((s) => {
    return new Date(s.enrolledOn).getFullYear() === thisYear;
  });

  // Per-course fee lookup
  const FEE_MAP: Record<string, number> = {
    LMV: 2500, MCWG: 1500, MCWOG: 1200, HMV: 4000, Transport: 5000,
  };
  const sumFees = (list: typeof students) =>
    list.reduce((acc, s) => acc + (FEE_MAP[s.course] ?? 0), 0);

  const earningsThisMonth = sumFees(enrolledThisMonth);
  const earningsThisYear = sumFees(enrolledThisYear);

  // Monthly breakdown for the past 6 months
  const monthlyBreakdown = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(thisYear, thisMonth - (5 - i), 1);
    const mo = d.getMonth();
    const yr = d.getFullYear();
    const count = students.filter((s) => {
      const sd = new Date(s.enrolledOn);
      return sd.getMonth() === mo && sd.getFullYear() === yr;
    });
    return {
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      count: count.length,
      earnings: sumFees(count),
    };
  });
  const maxEarnings = Math.max(...monthlyBreakdown.map((m) => m.earnings), 1);

  const stats = [
    {
      label: "Total Trainees",
      value: students.length,
      sub: "Total registered in school",
      Icon: Users,
      tone: "text-[#164535] bg-[#EAF1ED]",
    },
    {
      label: "Active In Training",
      value: inTrainingCount,
      sub: "Currently taking road sessions",
      Icon: Car,
      tone: "text-blue-700 bg-blue-50",
    },
    {
      label: "New Admissions",
      value: newEnrolledCount,
      sub: "Awaiting batch start",
      Icon: UserPlus,
      tone: "text-amber-700 bg-amber-50",
    },
    {
      label: "Completed Trainees",
      value: completedCount,
      sub: "Course completed",
      Icon: UserCheck,
      tone: "text-emerald-700 bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#164535] sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            BBC Motors Driving School · DTO Karimganj Lic. DTK/MDLS/02/2004
          </p>
        </div>
        <div className="flex items-center gap-2 border bg-card px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
          <CalendarDays className="h-4 w-4 text-[#C59E53]" />
          {today || "\u00a0"}
        </div>
      </div>

      {/* 4 Practical Trainee Stats Cards (Replacing the old certificate/graph cards) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const { Icon, tone } = s;
          return (
            <div key={s.label} className="border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </span>
                <div className={`grid h-9 w-9 place-items-center ${tone}`}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-[#164535]">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Earnings Analytics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="col-span-2 border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">This Month Earnings</span>
            <div className="grid h-9 w-9 place-items-center bg-emerald-50 text-emerald-700">
              <IndianRupee className="h-5 w-5" strokeWidth={2} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-[#164535]">
            ₹{earningsThisMonth.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{enrolledThisMonth.length} new admissions this month</p>
        </div>
        <div className="col-span-2 border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">This Year Earnings</span>
            <div className="grid h-9 w-9 place-items-center bg-amber-50 text-amber-700">
              <TrendingUp className="h-5 w-5" strokeWidth={2} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-[#164535]">
            ₹{earningsThisYear.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{enrolledThisYear.length} admissions in {thisYear}</p>
        </div>
      </div>

      {/* Monthly Earnings Bar Chart */}
      <Panel title="Monthly Admissions & Earnings (Last 6 Months)">
        <div className="flex items-end gap-3" style={{ height: "128px" }}>
          {monthlyBreakdown.map((m) => {
            const heightPct = maxEarnings > 0 ? Math.round((m.earnings / maxEarnings) * 100) : 0;
            return (
              <div key={m.label} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-[#164535]">
                  {m.earnings > 0 ? `₹${(m.earnings / 1000).toFixed(1)}k` : "—"}
                </span>
                <div className="relative w-full bg-slate-100" style={{ height: "72px" }}>
                  <div
                    className="absolute bottom-0 w-full bg-[#164535] transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">{m.label}</span>
                <span className="text-[9px] text-muted-foreground">{m.count} adm.</span>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Middle Section: Recent Registrations & Course Breakdown (No dummy graph) */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Recent Registrations"
          action={
            <Link
              to="/admin/students"
              className="flex items-center gap-1 text-xs font-semibold text-[#164535] hover:text-[#C59E53]"
            >
              View All Students <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="pb-2.5">Trainee</th>
                  <th className="pb-2.5">Course</th>
                  <th className="pb-2.5">Phone</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.slice(0, 5).map((r, i) => (
                  <tr key={r.id} className="hover:bg-muted/40">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center text-xs font-bold ${
                            AVATAR_TONES[i % 4]
                          }`}
                        >
                          {initials(r.name)}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800">{r.name}</p>
                          <p className="text-[11px] text-muted-foreground">ID: {r.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 font-medium text-slate-700">{r.course}</td>
                    <td className="py-2.5 font-mono text-muted-foreground">{r.phone}</td>
                    <td className="py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          r.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Course Wise Distribution */}
        <Panel title="Trainees by Course">
          <div className="space-y-3.5">
            {COURSES.map((c) => {
              const count = students.filter((s) => s.course === c.code).length;
              const pct = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
              return (
                <div key={c.code} className="border border-border/70 p-3 bg-muted/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#164535]">{c.name}</span>
                    <span className="font-bold text-slate-800">
                      {count} <span className="text-muted-foreground font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-[#164535]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Code: {c.code}</span>
                    <span>Duration: {c.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Bottom Section: Quick Actions & Driving School Info */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Panel title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: "/admin/students", label: "Add Student", Icon: UserPlus },
              { to: "/admin/certificates", label: "Certificates", Icon: FilePlus2 },
              { to: "/verify", label: "Verify QR / ID", Icon: ShieldCheck },
              { to: "/admin/announcements", label: "Notices", Icon: Megaphone },
            ].map(({ to, label, Icon }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center gap-2 border border-border bg-[#F5F4EF] p-4 text-xs font-bold text-[#164535] transition-colors hover:bg-[#EAF1ED] hover:border-[#C59E53]"
              >
                <Icon className="h-6 w-6 text-[#164535]" />
                {label}
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Driving School Status">
          <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
            <div className="border border-border p-3 bg-muted/10">
              <p className="text-[11px] text-muted-foreground">DTO Licence</p>
              <p className="mt-1 font-bold text-slate-800">DTK/MDLS/02/2004</p>
              <p className="mt-0.5 text-[10px] text-emerald-600 font-semibold">● Govt. Authorized</p>
            </div>
            <div className="border border-border p-3 bg-muted/10">
              <p className="text-[11px] text-muted-foreground">Certificates Issued</p>
              <p className="mt-1 font-bold text-slate-800">{certificates.length} Total</p>
              <p className="mt-0.5 text-[10px] text-emerald-600 font-semibold">● Tamper-Proof Digital</p>
            </div>
            <div className="border border-border p-3 bg-muted/10">
              <p className="text-[11px] text-muted-foreground">Training Fleet</p>
              <p className="mt-1 font-bold text-slate-800">Dual Control</p>
              <p className="mt-0.5 text-[10px] text-slate-600 font-medium">Cars, Bikes & HMV</p>
            </div>
            <div className="border border-border p-3 bg-muted/10">
              <p className="text-[11px] text-muted-foreground">Location</p>
              <p className="mt-1 font-bold text-slate-800">Karimganj / Sribhumi</p>
              <p className="mt-0.5 text-[10px] text-slate-600 font-medium">Station Road, Assam</p>
            </div>
            <div className="border border-border p-3 bg-muted/10">
              <p className="text-[11px] text-muted-foreground">Contact Helpline</p>
              <p className="mt-1 font-bold text-slate-800">+91 9401773029</p>
              <p className="mt-0.5 text-[10px] text-slate-600 font-medium">8:00 AM – 6:00 PM</p>
            </div>
            <div className="border border-border p-3 bg-muted/10">
              <p className="text-[11px] text-muted-foreground">Database</p>
              <p className="mt-1 font-bold text-slate-800">Live Firebase</p>
              <p className="mt-0.5 text-[10px] text-emerald-600 font-semibold">● Firestore Cloud Sync</p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
