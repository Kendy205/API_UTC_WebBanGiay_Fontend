import { BaseServices } from "./BaseService";

export class ProductService extends BaseServices
{
    constructor()
    {
        super();
    }
    getProducts =()=>
    {
        return this.get('api/Product');
    }
    getProductById = (productId) => {
        return this.get(`api/Product/${productId}`);
    } 
    getProductVariants = (productId) => {
        return this.get(`api/ProductVariant/${productId}`);
    }   
    
}
export const productService = new ProductService()