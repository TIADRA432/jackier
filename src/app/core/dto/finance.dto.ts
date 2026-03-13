export interface FinanceReportDto {
  id?: string;
  date: string;
  totalRevenue: number;
  expenses: number;
  netProfit: number;
  closedBy: string;
  closedAt: string;
  notes?: string;
}
