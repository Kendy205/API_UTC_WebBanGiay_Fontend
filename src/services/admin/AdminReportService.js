import { baseServices } from '../user/BaseService'

/**
 * AdminReportService
 *
 * GET  /api/Admin/reports/sales?from=ISO&to=ISO&groupBy=day|week|month
 *   â†’ { data:[{period,revenue,orders,avgValue}], summary:{totalRevenue,totalOrders,avgOrderValue,returnRate} }
 */
class AdminReportService {
    getSalesReport = (params = {}) =>
        baseServices.get('/api/Reports/sales', { params })
}

export const adminReportService = new AdminReportService()
