import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getProductReviewsThunk } from '../../redux/actions/user/reviewAction'

export default function ProductReviews({ productId }) {
    const dispatch = useDispatch()
    const { reviews, loadingReviews: loading } = useSelector(state => state.review)

    useEffect(() => {
        if (productId) {
            dispatch(getProductReviewsThunk(productId))
        }
    }, [productId, dispatch])

    if (loading) return <div className="mt-8 text-neutral-500">Đang tải đánh giá...</div>

    const reviewList = Array.isArray(reviews) ? reviews : []
    console.log(reviewList)
    return (
        <div className="mt-8 pt-8 border-t border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Đánh giá sản phẩm ({reviewList.length})</h3>
            {reviewList.length === 0 ? (
                <p className="text-sm text-neutral-500">Chưa có đánh giá nào cho sản phẩm này.</p>
            ) : (
                <div className="space-y-4">
                    {reviewList.map((r, idx) => (
                        <div key={r.reviewId || idx} className="bg-neutral-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="flex text-yellow-400 text-sm">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i}>{i < (r.rating || 5) ? '★' : '☆'}</span>
                                    ))}
                                </div>
                                {r.reviewTitle && <span className="font-semibold text-sm ml-3 text-neutral-800">{r.reviewTitle}</span>}
                                {r.username && <span className="font-medium text-xs ml-auto text-neutral-500">{r.username}</span>}
                                {r.createdAt && <span className="text-xs text-neutral-400 pl-3 ml-auto">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</span>}
                            </div>
                            {(r.colorName || r.sizeLabel) && (
                                <div className="text-xs text-neutral-500 mb-2 inline-block bg-neutral-200 px-2 py-0.5 rounded">
                                    Phân loại: {r.colorName} {r.sizeLabel && `- Size: ${r.sizeLabel}`}
                                </div>
                            )}
                            {r.reviewContent && <p className="text-sm text-neutral-700 mt-2">{r.reviewContent}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
