const filterFields = () => {
    return [
        {
            name: "job_title",
            type: "input",
            label: "Job Title",
            placeholder: "Search by job title",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "status",
            type: "select",
            label: "Status",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
    ];
};

export default filterFields;
