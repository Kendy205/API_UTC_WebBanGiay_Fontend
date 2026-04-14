import { BaseServices } from '../BaseService'

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
export class AdminProductService extends BaseServices {
    getAll = (params = {}) =>
        this.get('/api/Admin/products', { params })

    create = (data) => {
        const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
        return this.post('/api/Admin/products', data, config)
    }

    update = (id, data) => {
        const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
        return this.put(`/api/Admin/products/${id}`, data, config)
    }

    remove = (id) =>
        this.delete(`/api/Admin/products/${id}`)

    // Variants
    createVariant = (data) => this.post('/api/ProductVariant', data)
    updateVariant = (id, data) => this.put(`/api/ProductVariant/${id}`, data)
    removeVariant = (id) => this.delete(`/api/ProductVariant/${id}`)

    // Attributes
    getColors = () => this.get('/api/Color')
    getSizes = () => this.get('/api/Size')
}


export const adminProductService = new AdminProductService()
