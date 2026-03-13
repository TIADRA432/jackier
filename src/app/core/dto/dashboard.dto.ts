export interface DashboardStatsDto {
  todayReservations: number;
  pendingReservations: number;
  todayRevenue: number;
  monthlyRevenue: number;
  activeMenuItems: number;
  activeCatering: number;
  activePrograms: number;
}

export interface RevenueChartDto {
  month: string;
  total: number;
}

export interface ActivityDto {
  type: string;
  message: string;
  date: string;
}

export interface DashboardOverviewDto {
  stats: DashboardStatsDto;
  revenueChart: RevenueChartDto[];
  recentActivities: ActivityDto[];
}
