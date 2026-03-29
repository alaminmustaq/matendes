const filterFields = () => [
    {
        name: "job_title",
        label: "Job Title",
        type: "input",
        placeholder: "Filter by job title",
        colSpan: "col-span-12 md:col-span-6",
    },
    {
        name: "status",
        label: "Status",
        type: "select",
        placeholder: "All Status",
        options: [
            { value: "applied", label: "Applied" },
            { value: "confirmed", label: "Confirmed" },
            { value: "rejected", label: "Rejected" },
            { value: "interview", label: "Interview" },
        ],
        colSpan: "col-span-12 md:col-span-6",
    },
];

export default filterFields;
