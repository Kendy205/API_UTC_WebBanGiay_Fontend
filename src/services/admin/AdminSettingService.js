import { baseServices } from '../user/BaseService'

/**
 * AdminSettingService
 *
 * GET  /api/Admin/settings
 *   â†’ { siteName, contactEmail, currency, freeShippingThreshold,
 *       maintenanceMode, allowRegistration, lowStockThreshold, defaultTaxRate }
 *
 * PUT  /api/Admin/settings
 *   â† same object
 *   â†’ { success: true }
 */
class AdminSettingService {
    get = () => baseServices.get('/api/Admin/settings')
    update = (data) => baseServices.put('/api/Admin/settings', data)
}

export const adminSettingService = new AdminSettingService()
