import { BaseServices } from '../BaseService'

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
export class AdminInventoryService extends BaseServices {
    getAll = (params = {}) => this.get('/api/Admin/inventory', { params })
    update = (productId, data) =>
        this.put(`/api/Admin/inventory/${productId}`, data)
}

export const adminInventoryService = new AdminInventoryService()
