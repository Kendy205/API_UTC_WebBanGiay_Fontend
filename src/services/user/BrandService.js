import { BaseServices } from '../BaseService'

export class BrandService extends BaseServices {
    constructor() {
        super();
    }
    getAll = () => {
        return this.get('api/Brand');
    }
}

export const brandService = new BrandService()
