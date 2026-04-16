import { baseServices } from '../user/BaseService'

/**
 * AdminAnalyticsService
 */
class AdminAnalyticsService {
    getOverview = (year) => baseServices.get('/api/Analytics/overview', { params: { year } })
    getOrderStatusDistribution = (year) => baseServices.get('/api/Analytics/orders/status-distribution', { params: { year } })
    getRevenueChart = (params = {}) => baseServices.get('/api/Admin/analytics/revenue', { params })
}

export const adminAnalyticsService = new AdminAnalyticsService()
