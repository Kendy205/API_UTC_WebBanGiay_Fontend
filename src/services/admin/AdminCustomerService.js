import { BaseServices } from '../BaseService'

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
export class AdminCustomerService extends BaseServices {
    getAll = (params = {}) => this.get('/api/Admin/customers', { params })
    updateStatus = (id, isActive) =>
        this.put(`/api/Admin/customers/${id}/status`, { isActive })
}

export const adminCustomerService = new AdminCustomerService()
