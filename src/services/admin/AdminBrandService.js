import { BaseServices } from '../BaseService'

export class AdminBrandService extends BaseServices {
    getAll = () => this.get('/api/Admin/brands')
    create = (data) => this.post('/api/Admin/brands', data)
    update = (id, data) => this.put(`/api/Admin/brands/${id}`, data)
}

export const adminBrandService = new AdminBrandService()
