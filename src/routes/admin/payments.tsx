import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeading, Panel, StatusPill } from "@/components/portal/PortalShell";
import { PAYMENTS, formatDateLong } from "@/lib/school-data";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments — BBC Motors Admin" }, { name: "description", content: "Course fee payments." }] }),
  component: () => (
    <>
      <PageHeading title="Payments" subtitle="Course fee payments" />
      <Panel>
        <DataTable
          head={["Payment ID", "Student", "Amount", "Method", "Date", "Status"]}
          rows={PAYMENTS.map((p) => [
            <span className="font-mono text-xs">{p.id}</span>,
            p.student,
            <span className="font-semibold">₹{p.amount.toLocaleString("en-IN")}</span>,
            p.method,
            formatDateLong(p.date),
            <StatusPill status={p.status} />,
          ])}
        />
      </Panel>
    </>
  ),
});
