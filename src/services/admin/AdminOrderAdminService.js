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
    getAll = (params = {}) => this.get('/api/Admin/orders', { params })
    getById = (id) => this.get(`/api/Admin/orders/${id}`)
    updateStatus = (id, status) =>
        this.put(`/api/Admin/orders/${id}/status`, { status })
}

export const adminOrderAdminService = new AdminOrderAdminService()
