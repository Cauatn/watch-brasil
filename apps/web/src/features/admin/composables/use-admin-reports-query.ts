import { fetchAdminReportSummary } from "@/features/admin/services/reports";
import { useQuery } from "@tanstack/vue-query";

export function useAdminReportsQuery() {
  return useQuery({
    queryKey: ["admin", "reports", "summary"],
    queryFn: fetchAdminReportSummary,
  });
}
