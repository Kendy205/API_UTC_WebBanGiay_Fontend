import { baseServices } from '../user/BaseService'

/**
 * AdminLogService
 *
 * GET  /api/Admin/logs?page&level=INFO|WARNING|ERROR|DEBUG&from=ISO&to=ISO
 *   â†’ { data: [{id,level,message,userId,createdAt}], total }
 */
class AdminLogService {
    getAll = (params = {}) => baseServices.get('/api/Admin/logs', { params })
}

export const adminLogService = new AdminLogService()
