import { BaseServices } from '../BaseService'

/**
 * AdminReportService
 *
 * GET  /api/Admin/reports/sales?from=ISO&to=ISO&groupBy=day|week|month
 *   â†’ { data:[{period,revenue,orders,avgValue}], summary:{totalRevenue,totalOrders,avgOrderValue,returnRate} }
 */
export class AdminReportService extends BaseServices {
    getSalesReport = (params = {}) =>
        this.get('/api/Admin/reports/sales', { params })
}

export const adminReportService = new AdminReportService()
