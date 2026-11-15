import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BookOpen, FileBadge, House, SearchCheck, UserRound } from "lucide-react";
import { PortalShell, type PortalNavItem } from "@/components/portal/PortalShell";
import { initials, useCurrentStudent } from "@/lib/school-data";

const NAV: PortalNavItem[] = [
  { to: "/student", label: "My Dashboard", icon: House, exact: true },
  { to: "/student/course", label: "My Course", icon: BookOpen },
  { to: "/student/certificate", label: "My Certificate", icon: FileBadge },
  { to: "/verify", label: "Verification", icon: SearchCheck },
  { to: "/student/profile", label: "Profile", icon: UserRound },
];

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Portal — BBC Motors Driving School" },
      { name: "description", content: "Track your driving course and download your certificate." },
      { property: "og:title", content: "BBC Motors Student Portal" },
      { property: "og:description", content: "Your driving journey, all in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StudentPortalLayout,
});

function StudentPortalLayout() {
  const { student } = useCurrentStudent();
  return (
    <PortalShell
      title="BBC Motors"
      subtitle="Student Portal"
      nav={NAV}
      user={{ name: student.name, initial: initials(student.name) || "S" }}
    >
      <Outlet />
    </PortalShell>
  );
}
