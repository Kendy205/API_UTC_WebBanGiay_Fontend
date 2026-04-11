import { baseServices } from '../user/BaseService'

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
class AdminOrderAdminService {
    getAll = (params = {}) => baseServices.get('/api/Admin/orders', { params })
    getById = (id) => baseServices.get(`/api/Admin/orders/${id}`)
    updateStatus = (id, status) =>
        baseServices.put(`/api/Admin/orders/${id}/status`, { status })
}

export const adminOrderAdminService = new AdminOrderAdminService()
