import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formReset, handleServerValidationErrors } from "@/utility/helpers";
import {
    useFetchGeneralSettingsQuery,
    useUpdateGeneralSettingsMutation,
} from "../services/generalSettingApi";
import { useRef } from "react";

export const useGeneralSetting = () => {
    const { data, refetch, isFetching } = useFetchGeneralSettingsQuery();
    const [updateGeneralSettings] = useUpdateGeneralSettingsMutation();

    // Prevents repeated reset
    const initialized = useRef(false);

    // Create form
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        defaultValues: {
            company_name: "",
            allowed_file_types: "",
            icon: null,
            logo: null,
            favicon: null,
        },
    });

    if (!isFetching && data?.data && !initialized.current) {
        initialized.current = true;

        form.reset({
            ...data.data.setting,
            icon: null,
            logo: null,
            favicon: null,
        });
    }

    const actions = {
        onUpdate: async (values) => {
            try {
                const formData = new FormData();

                // Text fields
                formData.append("company_name", values.company_name);
                formData.append(
                    "allowed_file_types",
                    values.allowed_file_types || ""
                );

                // Files only if new
                if (values.icon instanceof File)
                    formData.append("icon", values.icon);
                if (values.logo instanceof File)
                    formData.append("logo", values.logo);
                if (values.favicon instanceof File)
                    formData.append("favicon", values.favicon);
                console.log(formData);
                
                await updateGeneralSettings({
                    id: values.id,
                    formData: formData,
                }).unwrap();

                toast.success("General settings updated successfully");

                //  Must wait refetch result (fresh updated data)
                const refreshed = await refetch().unwrap();

                //  Reset form with fresh database values
                form.reset({
                    ...refreshed.data,
                    icon: null,
                    logo: null,
                    favicon: null,
                });
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
            }
        },

        onEdit: (data) => {
            form.reset({
                ...data,
                icon: null,
                logo: null,
                favicon: null,
            });
            form.setValue("openModel", true);
        },
    };

    // console.log("General Settings API Data:", data?.data);

    return {
        generalSettingState: {
            data: data?.data || {},
            form,
            isFetching,
            refetch,
        },
        actions,
    };
};
