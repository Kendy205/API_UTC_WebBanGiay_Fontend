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
    getAll = (params = {}) => this.get('/api/User', { params })
    create = (data) => this.post('/api/User', data)
    update = (id, data) => this.put(`/api/User/${id}`, data)
}

export const adminCustomerService = new AdminCustomerService()
