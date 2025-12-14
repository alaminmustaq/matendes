"use client";

import PageLayout from "@/components/page-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import { useGeneralSetting } from "@/domains/settings/hook/useGeneralSetting";
import fields from "./config/fields";

const GeneralSettingsPage = () => {
    const { generalSettingState, actions } = useGeneralSetting();
    const { form } = generalSettingState;

    const onSubmit = (values) => actions.onUpdate(values);

    return (
        <PageLayout>
            <div className="bg-white p-6 rounded-md shadow">
                
                <DynamicForm
                    form={form}
                    fields={fields()}
                    onSubmit={onSubmit}
                    submitLabel="Save Changes"
                />

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={form.handleSubmit(onSubmit)}
                        className="bg-primary text-white px-5 py-2 rounded-md"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};


export default GeneralSettingsPage;
