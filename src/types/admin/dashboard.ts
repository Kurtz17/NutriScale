export interface WeeklySummary {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardData {
  totalUser: number;
  totalOrder: number;
  activeOrders: number;
  totalRevenue: number;
  weeklySummary: WeeklySummary[];
}
