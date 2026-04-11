import { baseServices } from '../user/BaseService'

/**
 * AdminRefundService
 *
 * GET  /api/Admin/refunds?page&status
 *   â†’ { data: [{id,orderId,customerName,amount,reason,status,createdAt}], total }
 *
 * PUT  /api/Admin/refunds/{id}/status
 *   â† { status: "Approved" | "Rejected" }
 *   â†’ { id, status }
 */
class AdminRefundService {
    getAll = (params = {}) => baseServices.get('/api/Admin/refunds', { params })
    updateStatus = (id, status) =>
        baseServices.put(`/api/Admin/refunds/${id}/status`, { status })
}

export const adminRefundService = new AdminRefundService()
