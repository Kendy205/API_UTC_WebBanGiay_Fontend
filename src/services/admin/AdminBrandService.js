import { BaseServices } from '../BaseService'

export class AdminBrandService extends BaseServices {
    getAll = () => this.get('/api/Brand')
    create = (data) => this.post('/api/Brand', data)
    update = (id, data) => this.put(`/api/Brand/${id}`, data)
    remove = (id) => this.delete(`/api/Brand/${id}`)
}

export const adminBrandService = new AdminBrandService()
