"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useLeaveApplication } from "@/domains/leave/leave-application/hook/useLeaveApplication";

const LeaveApplicationPage = () => {
    const { actions, leaveState } = useLeaveApplication();
    console.log(leaveState);
    
    return (
        <PageLayout>
            <BasicTableLayout
                addPermission={"manual-attendance"} 
                addButtonLabel={{
                        LeaveApplication: {
                            label: "Add Leave Application",
                            action: actions.onLeaveApplication,
                            permission: "create-leave",
                        },
                        DeleteGroupApplication: {
                            label: "Delete Group Application",
                            action: actions.onDeleteGroupApplication,
                            permission: "delete-group-leave",
                        },
                        ApprovedSingleApplication: {
                            label: "Approved Single Application",
                            action: actions.onApproveSingleApplication,
                            permission: "approve-single-leave",
                        },
                    }} 
                columns={columns(actions)}
                state={leaveState}
            />

            <BasicModel 
                title={
                    leaveState.form.watch("mode") === "view"
                    ? "Leave Application Details" 
                    : leaveState.form.watch("model_for") === "delete_group_leave" ? "Delete Group Leave"
                    : leaveState.form.watch("model_for") === "approve_single_leave" ? "Approve Leave" 
                    : leaveState.form.watch("id")
                    ? "Edit Leave Application" 
                    : "Create Leave Application"
                    }
                submitLabel={
                    leaveState.form.watch("mode") === "view"
                    ? null 
                    : leaveState?.form?.watch("model_for") === "delete_group_leave"
                            ? "Delete"
                    : leaveState?.form?.watch("model_for") === "approve_single_leave"
                            ? "Approve"
                    : leaveState.form.watch("id")
                    ? "Update"
                    : "Create"
                } 
                cancelLabel="Close"
                size="2xl"
                form={leaveState.form}
                fields={leaveState?.form?.watch("model_for") == "delete_group_leave" ? fields(leaveState.form, actions) : fields(leaveState.form, actions)} 
                actions={actions}
            />
        </PageLayout>
    );
};

export default LeaveApplicationPage;
