import { BaseServices } from '../BaseService'

/**
 * ShippingService — giao tiếp với backend ASP.NET để tính phí vận chuyển
 *
 * API Backend cần có (ASP.NET):
 *   GET /api/Shipping/calculate?fromLat=&fromLng=&toLat=&toLng=
 *   GET /api/Shipping/config
 */
class ShippingService extends BaseServices {
    /**
     * Tính phí ship dựa trên tọa độ
     * @param {number} fromLat - Latitude cửa hàng
     * @param {number} fromLng - Longitude cửa hàng
     * @param {number} toLat   - Latitude khách hàng
     * @param {number} toLng   - Longitude khách hàng
     */
    calculateShipping = (fromLat, fromLng, toLat, toLng) =>
        this.get(
            `/api/Shipping/calculate?fromLat=${fromLat}&fromLng=${fromLng}&toLat=${toLat}&toLng=${toLng}`,
            { __skipGlobalLoading: true }
        )

    /**
     * Lấy cấu hình phí ship (tọa độ cửa hàng, giá cơ bản, v.v.)
     */
    getShippingConfig = () =>
        this.get('/api/Shipping/config', { __skipGlobalLoading: true })
}

export const shippingService = new ShippingService()
