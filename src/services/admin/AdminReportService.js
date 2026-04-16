import { BaseServices } from '../BaseService'

/**
 * AdminReportService
 *
 * GET  /api/Reports/sales?from=YYYY-MM-DD&to=YYYY-MM-DD&groupBy=day|week|month
 *   → { summary:{totalRevenue,totalOrders,avgOrderValue,returnRate}, data:[{period,revenue,orders,avgValue}] }
 */
export class AdminReportService extends BaseServices {
    getSalesReport = (params = {}) =>
        this.get('/api/Reports/sales', { params })
}

export const adminReportService = new AdminReportService()
