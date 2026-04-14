import { BaseServices } from '../BaseService'

/**
 * AdminAnalyticsService
 *
 * GET  /api/Admin/analytics/overview
 *   -> { totalRevenue, totalOrders, newCustomers, avgOrderValue,
 *       revenueByMonth:[{month,revenue}], ordersByStatus:{...} }
 *
 * GET  /api/Admin/analytics/revenue?from=ISO&to=ISO
 *   -> [{ date, revenue, orders }]
 */
export class AdminAnalyticsService extends BaseServices {
    getOverview = () => this.get('/api/Analytics/overview')
    getRevenueChart = (params = {}) =>
        this.get('/api/Analytics/revenue', { params })
}

export const adminAnalyticsService = new AdminAnalyticsService()
