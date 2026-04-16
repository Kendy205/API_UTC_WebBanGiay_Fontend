import { BaseServices } from '../BaseService'

/**
 * AdminAnalyticsService
 */
class AdminAnalyticsService extends BaseServices {
    getOverview = (year) => this.get('/api/Analytics/overview', { params: { year } })
    getOrderStatusDistribution = (year) => this.get('/api/Analytics/orders/status-distribution', { params: { year } })
    getRevenueChart = (params = {}) => this.get('/api/Admin/analytics/revenue', { params })
}

export const adminAnalyticsService = new AdminAnalyticsService()
