import { BaseServices } from '../BaseService'

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
export class AdminRefundService extends BaseServices {
    getAll = (params = {}) => this.get('/api/Admin/refunds', { params })
    updateStatus = (id, status) =>
        this.put(`/api/Admin/refunds/${id}/status`, { status })
}

export const adminRefundService = new AdminRefundService()
