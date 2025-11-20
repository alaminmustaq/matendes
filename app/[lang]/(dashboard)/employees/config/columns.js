import { TableActions } from "@/components/table/TableActions";
import { useRouter, useParams } from "next/navigation";
import { setEmployData } from "@/domains/employ/model/employSlice";
import { useAppDispatch } from "@/hooks/use-redux";
import { useEmploy } from "@/domains/employ/hook/useEmploy";

const columns = (actions) => {
    const { actions: employeeActions } = useEmploy();
    const router = useRouter();
    const params = useParams();
    const lang = params?.lang || "en";
    const dispatch = useAppDispatch();

    return [
        {
            id: "name",
            header: "Name",
            cell: ({ row }) => {
                const p = row.original?.personal_info || {};
                return (
                    p.display_name ||
                    p.preferred_name ||
                    [p.first_name, p.last_name].filter(Boolean).join(" ") ||
                    "—"
                );
            },
        },
        {
            accessorKey: "employee_code",
            header: "Employee Id",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.employee_code || "—",
        },
        {
            accessorKey: "badge_number",
            header: "Badge",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.badge_number || "—",
        },
        {
            id: "department",
            header: "Department",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.department?.name || "—",
        },
        {
            id: "job_position_id",
            header: "Position",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.job_position?.title || "—",
        },
        {
            accessorKey: "contact_info.work_email",
            header: "Work Email",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.contact_info?.work_email || "—",
        },
        {
            accessorKey: "contact_info.primary_phone",
            header: "Phone",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) => row.original?.contact_info?.primary_phone || "—",
        },
        {
            accessorKey: "employment_info.employment_status",
            header: "Status",
            thClass: "!text-center",
            tdClass: "!text-center",
            cell: ({ row }) =>
                row.original?.employment_info?.employment_status || "—",
        },
        // Actions
        {
            id: "actions",
            enableHiding: false,
            header: "",
            thClass: "!text-center w-[70px] whitespace-nowrap",
            tdClass: "!text-center w-[70px] whitespace-nowrap",
            cell: ({ row }) => {
                const data = row.original;
                return (
                    <TableActions
                        data={data}
                        label="Actions"
                        items={[
                            {
                                label: "View",
                                onClick: (rowData) => {
                                    // Define the custom handler here
                                    // employeeActions.getEmploy(rowData?.id);
                                    router.push(
                                        `/${lang}/employee-details/${rowData?.id}`
                                    );
                                },
                                permission: "details-employee",
                            },
                            {
                                label: "Edit",
                                onClick: (rowData) => {
                                    // Define the custom handler here
                                    router.push(
                                        `/${lang}/employees/edit/${rowData?.id}`
                                    );
                                },
                                permission: "edit-employee",
                            },
                            {
                                label: "Delete",
                                onClick: actions?.onDelete,
                                danger: true,
                                passId: true,
                                permission: "delete-employee",
                            }, // needs only ID
                        ]}
                    />
                );
            },
        },
    ];
};

export default columns;
