import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeading, Panel, StatusPill } from "@/components/portal/PortalShell";
import { VERIFICATION_LOGS } from "@/lib/school-data";

export const Route = createFileRoute("/admin/verification-logs")({
  head: () => ({ meta: [{ title: "Verification Logs — BBC Motors Admin" }, { name: "description", content: "Every certificate check made on the website." }] }),
  component: () => (
    <>
      <PageHeading title="Verification Logs" subtitle="Every certificate check made on the website" />
      <Panel>
        <DataTable
          head={["Time", "Certificate No", "Result", "IP address"]}
          rows={VERIFICATION_LOGS.map((l) => [l.at, <span className="font-mono text-xs">{l.number}</span>, <StatusPill status={l.result} />, l.ip])}
        />
      </Panel>
    </>
  ),
});
