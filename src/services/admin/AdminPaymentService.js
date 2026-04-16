import { BaseServices } from '../BaseService'

/**
 * AdminPaymentService
 *
 * GET  /api/Admin/payments?page&pageSize&status&method
 *   â†’ { data: [{id,orderId,customerName,amount,method,status,createdAt}], total }
 */
export class AdminPaymentService extends BaseServices {
    getAll = (params = {}) => this.get('/api/Admin/payments', { params })
}

export const adminPaymentService = new AdminPaymentService()
