"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import formFields from "./config/fields";
import columns from "./config/columns";
import { useReport } from "@/domains/report/hook/useReport";
import { Button } from "@/components/ui/button";
import ReportActions from "@/components/report/ReportActions";

const EmployeeReportPage = () => {
    const { actions, reportState } = useReport("employees"); // generic route

    return (
        <PageLayout>
            {/* Filter Form */}
            <div className="bg-white p-6 rounded-md shadow mb-6">
                {/* Dynamic Filter Form */}
                <DynamicForm
                    form={reportState.form}
                    fields={formFields(reportState.form)}
                    onSubmit={actions.onFilter}
                />

                {/* Action Buttons */}
                <ReportActions
                    form={reportState.form}
                    onFilter={actions.onFilter}
                    onReset={() => reportState.form.reset()}
                    onPdf={actions.exportPdf}
                    onExcel={actions.exportExcel}
                    onPrint={actions.print}
                />
            </div>

            {/* Table */}
            <BasicTableLayout
                columns={columns()}
                state={reportState}
                search={false}
                addPermission={null}
            />
        </PageLayout>
    );
};

export default EmployeeReportPage;
