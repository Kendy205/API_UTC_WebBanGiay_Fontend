import { baseServices } from '../user/BaseService'

/**
 * AdminStaffService
 *
 * GET  /api/Admin/staff
 *   â†’ [{ id, fullName, email, role, isActive, createdAt }]
 *
 * POST /api/Admin/staff
 *   â† { fullName, email, password, role: "ADMIN"|"MANAGER"|"STAFF" }
 *   â†’ { id, fullName, email, role }
 *
 * PUT  /api/Admin/staff/{id}
 *   â† { fullName, email, role, isActive }
 *   â†’ { id, ... }
 *
 * DELETE /api/Admin/staff/{id}
 *   â†’ { success: true }
 */
class AdminStaffService {
    getAll = () => baseServices.get('/api/Admin/staff')
    create = (data) => baseServices.post('/api/Admin/staff', data)
    update = (id, data) => baseServices.put(`/api/Admin/staff/${id}`, data)
    remove = (id) => baseServices.delete(`/api/Admin/staff/${id}`)
}

export const adminStaffService = new AdminStaffService()
