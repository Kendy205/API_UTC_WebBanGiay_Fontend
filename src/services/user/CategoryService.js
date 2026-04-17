import { BaseServices } from '../BaseService'

export class CategoryService extends BaseServices {
    constructor() {
        super();
    }
    getAll = () => {
        return this.get('api/Category');
    }
}

export const categoryService = new CategoryService()
