import { TableActions } from "@/components/table/TableActions";

const leaveDetailsReportColumns = () => [
   {
    accessorKey: "employee.first_name",
    header: "Employee",
    thClass: "!text-left",
    tdClass: "!text-left",
    cell: ({ row }) => {
      const emp = row.original.employee;
      return emp ? `${emp.first_name} ${emp.last_name ?? ""}` : "-";
    },
  },
 
  {
    accessorKey: "leave_type.name",
    header: "Leave Type",
  },
  {
    accessorKey: "start_date",
    header: "From",
    cell: ({ row }) =>
      new Date(row.original.start_date).toLocaleDateString(),
  },
  {
    accessorKey: "end_date",
    header: "To",
    cell: ({ row }) =>
      new Date(row.original.end_date).toLocaleDateString(),
  },
  {
    accessorKey: "leave_day",
    header: "Days",
    thClass: "!text-center",
    tdClass: "!text-center",
  },
  {
    accessorKey: "leave_status",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const status = row.original.leave_status;
      const colors = {
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
      };
      return (
        <span className={`px-2 py-0.5 rounded-full ${colors[status]}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    thClass: "!text-center",
    tdClass: "!text-center",
  },
 {
  id: "reason",
  header: "Reason",
  cell: ({ row }) => {
    return (
      row.original.reason?.name ||
      row.original.other_reason ||
      "—"
    );
  },
}


];

export default leaveDetailsReportColumns;
