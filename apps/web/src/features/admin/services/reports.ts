import { api } from "@/lib/api";

export type AdminReportSummary = {
  totals: {
    users: number;
    videos: number;
    comments: number;
    tasks: number;
  };
  tasksByStatus: Record<string, number>;
  tasksByCategory: Record<string, number>;
  watchlistOpen: number;
  newUsersLast7Days: number;
};

export async function fetchAdminReportSummary() {
  const { data } = await api.get<AdminReportSummary>(
    "/admin/reports/summary",
  );
  return data;
}
