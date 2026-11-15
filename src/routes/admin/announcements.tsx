import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { toast } from "sonner";
import { PageHeading, Panel } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateLong, useAnnouncements, saveAnnouncement } from "@/lib/school-data";

export const Route = createFileRoute("/admin/announcements")({
  head: () => ({ meta: [{ title: "Announcements — BBC Motors Admin" }, { name: "description", content: "Send notices to students." }] }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const { announcements, loading } = useAnnouncements();

  return (
    <>
      <PageHeading title="Announcements" subtitle={loading ? "Loading from database..." : "Send live notices to students"} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Panel title="Send Notice">
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const newNotice = {
                id: `ANN-${Date.now()}`,
                title: String(f.get("title")),
                date: new Date().toISOString().slice(0, 10),
                audience: String(f.get("audience")),
              };
              await saveAnnouncement(newNotice);
              e.currentTarget.reset();
              toast.success("Notice saved to database");
            }}
          >
            <div className="space-y-2"><Label htmlFor="title">Notice</Label><Input id="title" name="title" required /></div>
            <div className="space-y-2">
              <Label htmlFor="audience">Send to</Label>
              <select id="audience" name="audience" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option>All students</option><option>LMV</option><option>MCWG</option><option>MCWOG</option><option>HMV</option>
              </select>
            </div>
            <Button type="submit" className="w-full"><Megaphone className="h-4 w-4" /> Send</Button>
          </form>
        </Panel>
        <Panel title="Sent notices">
          <ul className="divide-y">
            {announcements.map((a) => (
              <li key={a.id} className="py-3">
                <p className="font-semibold">{a.title}</p>
                <p className="text-xs text-muted-foreground">{formatDateLong(a.date)} • {a.audience}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
