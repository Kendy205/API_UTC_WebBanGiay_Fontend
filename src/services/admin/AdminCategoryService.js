import { BaseServices } from '../BaseService'

/**
 * AdminCategoryService
 *
 * GET  /api/Admin/categories
 *   â†’ [{ id, name, description, productCount, isActive }]
 *
 * POST /api/Admin/categories
 *   â† { name, description }
 *   â†’ { id, name, description }
 *
 * PUT  /api/Admin/categories/{id}
 *   â† { name, description, isActive }
 *   â†’ { id, ... }
 *
 * DELETE /api/Admin/categories/{id}
 *   â†’ { success: true }
 */
export class AdminCategoryService extends BaseServices {
    getAll = () => this.get('/api/Category')
    create = (data) => this.post('/api/Category', data)
    update = (id, data) => this.put(`/api/Category/${id}`, data)
    remove = (id) => this.delete(`/api/Category/${id}`)
}

export const adminCategoryService = new AdminCategoryService()
