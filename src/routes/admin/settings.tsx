import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeading, Panel } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SCHOOL } from "@/lib/school-data";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — BBC Motors Admin" }, { name: "description", content: "School details shown on certificates." }] }),
  component: () => (
    <>
      <PageHeading title="Settings" subtitle="School details shown on certificates" />
      <Panel className="max-w-2xl">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Settings saved"); }}>
          <div className="space-y-2"><Label htmlFor="sname">School name</Label><Input id="sname" defaultValue={SCHOOL.name} /></div>
          <div className="space-y-2"><Label htmlFor="lic">Licence No.</Label><Input id="lic" defaultValue={SCHOOL.licenceNo} /></div>
          <div className="space-y-2"><Label htmlFor="ph">Phone numbers</Label><Input id="ph" defaultValue={SCHOOL.phones.join(" / ")} /></div>
          <div className="space-y-2"><Label htmlFor="addr">Address</Label><Input id="addr" defaultValue={SCHOOL.address} /></div>
          <Button type="submit">Save changes</Button>
        </form>
      </Panel>
    </>
  ),
});
