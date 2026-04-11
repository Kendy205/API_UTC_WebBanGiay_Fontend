import { baseServices } from '../user/BaseService'

/**
 * AdminReviewAdminService
 *
 * GET  /api/Admin/reviews?page&pageSize&rating
 *   â†’ { data: [{id,productName,customerName,rating,comment,createdAt,isVisible}], total }
 *
 * PUT  /api/Admin/reviews/{id}/visibility
 *   â† { isVisible: bool }
 *   â†’ { id, isVisible }
 *
 * DELETE /api/Admin/reviews/{id}
 *   â†’ { success: true }
 */
class AdminReviewAdminService {
    getAll = (params = {}) => baseServices.get('/api/Admin/reviews', { params })
    updateVisibility = (id, isVisible) =>
        baseServices.put(`/api/Admin/reviews/${id}/visibility`, { isVisible })
    remove = (id) => baseServices.delete(`/api/Admin/reviews/${id}`)
}

export const adminReviewAdminService = new AdminReviewAdminService()
