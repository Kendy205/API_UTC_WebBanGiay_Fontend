import { baseServices } from '../user/BaseService'

/**
 * AdminInventoryService
 *
 * GET  /api/Admin/inventory?lowStock=false
 *   â†’ [{ productId, productName, sku, stock, sold, imageUrl, lowStockThreshold }]
 *
 * PUT  /api/Admin/inventory/{productId}
 *   â† { stock, lowStockThreshold }
 *   â†’ { productId, stock }
 */
class AdminInventoryService {
    getAll = (params = {}) => baseServices.get('/api/Admin/inventory', { params })
    update = (productId, data) =>
        baseServices.put(`/api/Admin/inventory/${productId}`, data)
}

export const adminInventoryService = new AdminInventoryService()
