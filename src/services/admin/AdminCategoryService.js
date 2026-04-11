import { baseServices } from '../user/BaseService'

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
class AdminCategoryService {
    getAll = () => baseServices.get('/api/Admin/categories')
    create = (data) => baseServices.post('/api/Admin/categories', data)
    update = (id, data) => baseServices.put(`/api/Admin/categories/${id}`, data)
    remove = (id) => baseServices.delete(`/api/Admin/categories/${id}`)
}

export const adminCategoryService = new AdminCategoryService()
