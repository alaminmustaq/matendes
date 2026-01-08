import { TableActions } from "@/components/table/TableActions";

const leaveApplicationColumns = (actions) => [
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
    thClass: "!text-center",
    tdClass: "!text-center",
  },
  {
    accessorKey: "start_date",
    header: "From",
    cell: ({ row }) => {
      const date = row.original.start_date;
      return date ? new Date(date).toLocaleDateString() : "—";
    },
  },
  {
    accessorKey: "end_date",
    header: "To",
    cell: ({ row }) => {
      const date = row.original.end_date;
      return date ? new Date(date).toLocaleDateString() : "—";
    },
  },
  {
    accessorKey: "leave_day",
    header: "Remaining Days",
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
    cell: ({ row }) => {
      const status = row.original.type;
      const colors = {
        single: "bg-blue-100 text-blue-700",
        grouped: "bg-orange-100 text-orange-700", 
      };
      return (
        <span className={`px-2 py-0.5 rounded-full ${colors[status]}`}>
          {status}
        </span>
      );
    },
  },
  // {
  //   accessorKey: "leave_type.is_paid",
  //   header: "Salary Impact",
  //   thClass: "!text-center",
  //   tdClass: "!text-center",
  //   cell: ({ row }) => {
  //     return row.original.leave_type?.is_paid === "paid" ? (
  //       <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
  //         Paid
  //       </span>
  //     ) : (
  //       <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
  //         Unpaid
  //       </span>
  //     );
  //   },
  // },
  {
    id: "actions",
    header: " ",
    thClass: "!text-center w-[70px]",
    tdClass: "!text-center w-[70px]",
    cell: ({ row }) => {
      const type = row.original.type;

      // 🚫 No actions for grouped leaves
      if (type === "grouped") {
        return <span className="text-gray-400">—</span>;
      }

      return (
        <TableActions
          data={row.original}
          label="Actions"
          items={[
            {
              label: "View",
              onClick: actions?.onView,
              permission: "view-leave",
            },
            {
              label: "Edit",
              onClick: actions?.onEdit,
              permission: "edit-leave",
            },
            {
              label: "Delete",
              onClick: actions?.onDelete,
              danger: true,
              passId: true,
              permission: "delete-leave",
            },
          ]}
        />
      );
    },
  }

];

export default leaveApplicationColumns;
