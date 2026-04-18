import { BaseServices } from '../BaseService'

/**
 * AdminCategoryService
 *
 * GET /Admin/Category
 *   → { success, data: [{ categoryId, categoryName, slug, isActive }] }
 *
 * POST /Admin/Category
 *   ← { categoryName, slug, isActive }
 *   → { success, data: { ... } }
 *
 * PUT /Admin/Category/{id}
 *   ← { categoryId, categoryName, slug, isActive }
 *   → { success, ... }
 *
 * DELETE /Admin/Category/{id}
 *   → { success: true }
 */
export class AdminCategoryService extends BaseServices {
    getAll = () => this.get('/api/Admin/Category')
    create = (data) => this.post('/api/Admin/Category', data)
    update = (id, data) => this.put(`/api/Admin/Category/${id}`, data)
    remove = (id) => this.delete(`/api/Admin/Category/${id}`)
}

export const adminCategoryService = new AdminCategoryService()
