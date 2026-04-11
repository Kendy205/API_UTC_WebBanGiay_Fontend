import { baseServices } from '../user/BaseService'

/**
 * AdminCustomerService
 *
 * GET  /api/Admin/customers?page&pageSize&search
 *   â†’ { data: [{id,fullName,email,phone,totalOrders,totalSpent,createdAt,isActive}], total }
 *
 * PUT  /api/Admin/customers/{id}/status
 *   â† { isActive: bool }
 *   â†’ { id, isActive }
 */
class AdminCustomerService {
    getAll = (params = {}) => baseServices.get('/api/Admin/customers', { params })
    updateStatus = (id, isActive) =>
        baseServices.put(`/api/Admin/customers/${id}/status`, { isActive })
}

export const adminCustomerService = new AdminCustomerService()
