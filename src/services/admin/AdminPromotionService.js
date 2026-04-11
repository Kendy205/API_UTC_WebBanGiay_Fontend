import { baseServices } from '../user/BaseService'

/**
 * AdminPromotionService
 *
 * GET  /api/Admin/promotions
 *   â†’ [{ id, code, discountType, discountValue, minOrderValue, usedCount, maxUsage, startDate, endDate, isActive }]
 *
 * POST /api/Admin/promotions
 *   â† { code, discountType:"Percent"|"Fixed", discountValue, minOrderValue, maxUsage, startDate, endDate }
 *   â†’ { id, code, ... }
 *
 * PUT  /api/Admin/promotions/{id}
 *   â† { code, discountType, discountValue, minOrderValue, maxUsage, startDate, endDate, isActive }
 *   â†’ { id, ... }
 *
 * DELETE /api/Admin/promotions/{id}
 *   â†’ { success: true }
 */
class AdminPromotionService {
    getAll = () => baseServices.get('/api/Admin/promotions')
    create = (data) => baseServices.post('/api/Admin/promotions', data)
    update = (id, data) => baseServices.put(`/api/Admin/promotions/${id}`, data)
    remove = (id) => baseServices.delete(`/api/Admin/promotions/${id}`)
}

export const adminPromotionService = new AdminPromotionService()
