"use client";
import React from "react";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import permissionColumns from "./config/permissionColumns";
import fields from "./config/fields";
import { useRole } from "@/domains/role-and-permission/role/hook/useRole";

const RolePage = () => {
    const { actions, rolesState } = useRole(); // Custom hook handles roles and permissions

    const form = rolesState.form;
    const isEdit = !!form?.watch("id");
    const isPermissionMode = !!form?.watch("openPermissionMode");
    // console.log(rolesState.permissions);
    
    return (
        <PageLayout>
            {/* Role Table */}
            <BasicTableLayout
                addPermission={"edit-branch"}
                addButtonLabel="Add Role"
                columns={columns(actions)}
                state={rolesState}
            />

            {/* Role Create/Edit Modal */}
            <BasicModel
                title={
                    isPermissionMode
                        ? "Permission Update"
                        : isEdit
                        ? "Role Edit"
                        : "Role Create"
                }
                submitLabel={isEdit || isPermissionMode ? "Update" : "Create"}
                cancelLabel="Cancel"
                size="2xl"
                form={rolesState.form}
                fields={isPermissionMode ? [] : fields}
                actions={actions}
            >
                <BasicTableLayout
                    addButtonLabel={false}
                    columns={permissionColumns(actions, form)}
                    state={{
                        form: rolesState.form,
                        data: rolesState.permissions,
                        pagination: true,
                        isFetching: false,
                    }}
                    filter={false}
                />
            </BasicModel>
        </PageLayout>
    );
};

export default RolePage;
