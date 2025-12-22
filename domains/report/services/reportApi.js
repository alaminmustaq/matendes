import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const reportApi = createApi({
    reducerPath: "ReportApi",
    baseQuery,
    tagTypes: ["Report"],
    endpoints: (builder) => ({
        fetchReport: builder.query({
            query: ({ route = "reports", params = {} }) => ({
                url: `hrm/${route}`,
                params: {
                    ...getFilterParams(),
                    ...params,
                },
            }),
            providesTags: ["Report"],
        }),
    }),
});

export const { useLazyFetchReportQuery } = reportApi;
