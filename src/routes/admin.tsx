import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { BookOpen, FileBadge, FileSearch, House, Megaphone, Settings, Users, Wallet } from "lucide-react";
import { PortalShell, type PortalNavItem } from "@/components/portal/PortalShell";
import { getAdminSession, clearAdminSession } from "@/lib/admin-auth";

const NAV: PortalNavItem[] = [
  { to: "/admin", label: "Dashboard", icon: House, exact: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/certificates", label: "Certificates", icon: FileBadge },
  { to: "/admin/verification-logs", label: "Verification Logs", icon: FileSearch },
  { to: "/admin/payments", label: "Payments", icon: Wallet },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    // Allow the login page itself to pass through without an auth check
    if (location.pathname === "/admin/login") return;
    if (!getAdminSession()) {
      throw redirect({ to: "/admin/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin Panel — BBC Motors Driving School" },
      { name: "description", content: "Manage students, courses, certificates and payments." },
      { property: "og:title", content: "BBC Motors Admin Panel" },
      { property: "og:description", content: "Admin tools for BBC Motors Driving School." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  return (
    <PortalShell
      title="BBC Motors"
      subtitle="Admin Panel"
      nav={NAV}
      user={{ name: "Admin", initial: "A" }}
      onLogout={() => {
        clearAdminSession();
        navigate({ to: "/admin/login" });
      }}
    >
      <Outlet />
    </PortalShell>
  );
}
