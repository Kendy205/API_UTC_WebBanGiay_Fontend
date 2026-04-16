import { BaseServices } from '../BaseService'

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
export class AdminReviewAdminService extends BaseServices {
    getAll = (params = {}) => this.get('/api/Admin/reviews', { params })
    updateVisibility = (id, isPublic) =>
        this.put(`/api/Admin/reviews/${id}/ispublic`, { isPublic })
}

export const adminReviewAdminService = new AdminReviewAdminService()
