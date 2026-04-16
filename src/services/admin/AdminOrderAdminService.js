import { BaseServices } from '../BaseService'

/**
 * AdminOrderAdminService
 *
 * GET  /api/Admin/orders?page&pageSize&status&search
 *   â†’ { data: [{id,customerName,total,status,createdAt,itemCount,paymentMethod}], total }
 *
 * GET  /api/Admin/orders/{id}
 *   â†’ { id, customerName, items:[], address, total, status, paymentMethod }
 *
 * PUT  /api/Admin/orders/{id}/status
 *   â† { status: "Confirmed" | "Shipping" | "Completed" | "Cancelled" }
 *   â†’ { id, status }
 */
export class AdminOrderAdminService extends BaseServices {
    getAll = (params = {}) => this.get('/api/Admin/Orders', { params })
    getById = (id) => this.get(`/api/Admin/Orders/${id}`)
    update = (id, data) => this.put(`/api/Admin/Orders/${id}`, data)
    remove = (id) => this.delete(`/api/Admin/Orders/${id}`)
}

export const adminOrderAdminService = new AdminOrderAdminService()
