import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeading, Panel, StatusPill } from "@/components/portal/PortalShell";
import { formatDateLong, useStudents } from "@/lib/school-data";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments — BBC Motors Admin" }, { name: "description", content: "Course fee payments." }] }),
  component: AdminPaymentsPage,
});

function AdminPaymentsPage() {
  const { students, loading } = useStudents();
  const payments = students
    .filter((s) => s.amountPaid && Number(s.amountPaid) > 0)
    .map((s) => ({
      id: `PAY-${s.id.replace(/\//g, "-")}`,
      student: s.name,
      amount: Number(s.amountPaid),
      method: s.paymentMethod || "Cash",
      date: s.enrolledOn,
      status: "Paid" as const,
    }));

  return (
    <>
      <PageHeading
        title="Payments"
        subtitle={loading ? "Loading payments from database..." : `${payments.length} fee payments recorded`}
      />
      <Panel>
        <DataTable
          head={["Payment ID", "Student", "Amount", "Method", "Date", "Status"]}
          rows={payments.map((p) => [
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
  );
}
