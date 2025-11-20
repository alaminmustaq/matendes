"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import BasicModel from "@/components/model/basic-model";
import { useSalary } from "@/domains/salary/hook/useSalary";

const SalaryGeneratePage = () => {
    const { actions, salaryState } = useSalary(); // Use salaryState from hook

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission={"generate_salary"}
                addButtonLabel="Generate Salary"
                columns={columns(actions)}
                state={salaryState }
                
            />
            <BasicModel
                title="Generate Salary"
                submitLabel="Generate"
                cancelLabel="Cancel"
                size="2xl"
                form={salaryState.form}
                fields={fields(actions)}
                actions={actions}
            />
        </PageLayout>
    );
};

export default SalaryGeneratePage;
