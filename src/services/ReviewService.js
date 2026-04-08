import { BaseServices } from './BaseService'

export class ReviewService extends BaseServices {
    /**
     * Gửi đánh giá cho một sản phẩm (order item).
     * POST /api/Review
     */
    createReview = (body) => this.post('api/Review', body)

    /**
     * Lấy danh sách đánh giá của sản phẩm
     * GET /api/Review/product/{productId}
     */
    getProductReviews = (productId) => this.get(`api/Review/product/${productId}`)
}

export const reviewService = new ReviewService()
