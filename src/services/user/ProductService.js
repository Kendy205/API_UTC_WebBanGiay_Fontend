import { BaseServices } from '../BaseService'

export class ProductService extends BaseServices
{
    constructor()
    {
        super();
    }
    getProducts = ({ page = 1, pageSize = 10 } = {}) => {
        return this.get('api/Product', { params: { page, pageSize } });
    }
    getProductById = (productId) => {
        return this.get(`api/Product/${productId}`);
    }
    filterProducts = (params = {}) => {
        // params: { keyword, categoryId, brandId, minPrice, maxPrice, pageNumber, pageSize }
        return this.get('api/Product/filter', { params });
    }
    // getProductVariants = (productId) => {
    //     return this.get(`api/ProductDetail/${productId}`);
    // }   
    
}
export const productService = new ProductService()