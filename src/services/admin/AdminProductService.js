import { baseServices } from '../user/BaseService'

/**
 * AdminProductService
 *
 * GET  /api/Admin/products?page&pageSize&search
 *   â†’ { data: [{id,name,price,stock,categoryId,categoryName,imageUrl,isActive,sold}], total, page, pageSize }
 *
 * POST /api/Admin/products
 *   â† { name, description, price, stock, categoryId, imageUrl }
 *   â†’ { id, name, ... }
 *
 * PUT  /api/Admin/products/{id}
 *   â† { name, description, price, stock, categoryId, imageUrl, isActive }
 *   â†’ { id, name, ... }
 *
 * DELETE /api/Admin/products/{id}
 *   â†’ { success: true }
 */
class AdminProductService {
    getAll = (params = {}) =>
        baseServices.get('/api/Admin/products', { params })

    create = (data) =>
        baseServices.post('/api/Admin/products', data)

    update = (id, data) =>
        baseServices.put(`/api/Admin/products/${id}`, data)

    remove = (id) =>
        baseServices.delete(`/api/Admin/products/${id}`)
}

export const adminProductService = new AdminProductService()
