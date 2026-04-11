import { baseServices } from '../user/BaseService'

/**
 * AdminAnalyticsService
 *
 * GET  /api/Admin/analytics/overview
 *   â†’ { totalRevenue, totalOrders, newCustomers, avgOrderValue,
 *       revenueByMonth:[{month,revenue}], ordersByStatus:{...} }
 *
 * GET  /api/Admin/analytics/revenue?from=ISO&to=ISO
 *   â†’ [{ date, revenue, orders }]
 */
class AdminAnalyticsService {
    getOverview = () => baseServices.get('/api/Admin/analytics/overview')
    getRevenueChart = (params = {}) =>
        baseServices.get('/api/Admin/analytics/revenue', { params })
}

export const adminAnalyticsService = new AdminAnalyticsService()
