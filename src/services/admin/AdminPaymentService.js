import { baseServices } from '../user/BaseService'

/**
 * AdminPaymentService
 *
 * GET  /api/Admin/payments?page&pageSize&status&method
 *   â†’ { data: [{id,orderId,customerName,amount,method,status,createdAt}], total }
 */
class AdminPaymentService {
    getAll = (params = {}) => baseServices.get('/api/Admin/payments', { params })
}

export const adminPaymentService = new AdminPaymentService()
