import { useForm } from "react-hook-form";
import { useLazyFetchReportQuery } from "../services/reportApi";
import { normalizeSelectValues } from "@/utility/helpers";

export const useReport = (route = "reports") => {
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: {
            branch_id: null,
            department_id: null,
            job_position_id: null,
            role_id: null,
            date_from: "",
            date_to: "",
            employment_status: "",
            employment_type: "",
            gender: "",
            work_mode: "",
        },
    });

    const [fetchReport, { data, isFetching }] = useLazyFetchReportQuery();

    const reportState = {
        data: data?.data?.employees || [],   // ← THIS FIXES THE TABLE
        pagination: data?.data?.pagination || {},
        isFetching,
        form,
    }; 
    const actions = {
        onFilter: async (filters) => {
            const normalizedPayload = normalizeSelectValues(filters, [
                "branch_id",
                "department_id",
                "job_position_id",
                "role_id",
            ]);

            fetchReport({ route, params: normalizedPayload });
        },

        exportPdf: () => {
            const normalizedPayload = normalizeSelectValues(form.getValues(), [
                "branch_id",
                "department_id",
                "job_position_id",
                "role_id",
            ]);

            window.open(
                `/reports/${route}/pdf?${new URLSearchParams(normalizedPayload)}`,
                "_blank"
            );
        },

        exportExcel: () => {
            const normalizedPayload = normalizeSelectValues(form.getValues(), [
                "branch_id",
                "department_id",
                "job_position_id",
                "role_id",
            ]);

            window.open(
                `/reports/${route}/excel?${new URLSearchParams(normalizedPayload)}`,
                "_blank"
            );
        },

        print: () => {
            const normalizedPayload = normalizeSelectValues(form.getValues(), [
                "branch_id",
                "department_id",
                "job_position_id",
                "role_id",
            ]);

            window.open(
                `/reports/${route}/print?${new URLSearchParams(normalizedPayload)}`,
                "_blank"
            );
        },
    };

    return {
        actions,
        reportState,
    };
};
