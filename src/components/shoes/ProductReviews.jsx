import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getProductReviewsThunk } from '../../redux/actions/user/reviewAction'

// Palette màu cho avatar — tạo màu nhất quán theo tên
const AVATAR_COLORS = [
    ['#f87171', '#fff'],
    ['#fb923c', '#fff'],
    ['#facc15', '#1a1a1a'],
    ['#4ade80', '#1a1a1a'],
    ['#34d399', '#1a1a1a'],
    ['#38bdf8', '#1a1a1a'],
    ['#818cf8', '#fff'],
    ['#c084fc', '#fff'],
    ['#f472b6', '#fff'],
    ['#94a3b8', '#fff'],
]

function getAvatarColor(name = '') {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name = '') {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ReviewerAvatar({ username }) {
    const initials = getInitials(username)
    const [bg, color] = getAvatarColor(username)
    return (
        <div
            style={{ backgroundColor: bg, color, width: 38, height: 38, minWidth: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, userSelect: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}
            title={username}
        >
            {initials}
        </div>
    )
}

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

    return (
        <div className="mt-8 pt-8 border-t border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Đánh giá sản phẩm ({reviewList.length})
            </h3>

            {reviewList.length === 0 ? (
                <p className="text-sm text-neutral-500">Chưa có đánh giá nào cho sản phẩm này.</p>
            ) : (
                <div className="space-y-4">
                    {reviewList.map((r, idx) => (
                        <div key={r.reviewId || idx} className="bg-neutral-50 p-4 rounded-lg">
                            {/* Header: Avatar + Tên + Rating + Ngày */}
                            <div className="flex items-center gap-3 mb-2">
                                <ReviewerAvatar username={r.userName || r.username || ''} />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <span className="font-semibold text-sm text-neutral-800 truncate">
                                            {r.userName || r.username || 'Người dùng ẩn danh'}
                                        </span>
                                        {r.createdAt && (
                                            <span className="text-xs text-neutral-400 shrink-0">
                                                {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="flex text-yellow-400 text-sm leading-none">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i}>{i < (r.rating || 5) ? '★' : '☆'}</span>
                                            ))}
                                        </div>
                                        {r.reviewTitle && (
                                            <span className="font-medium text-xs text-neutral-600">
                                                {r.reviewTitle}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Phân loại */}
                            {(r.colorName || r.sizeLabel) && (
                                <div className="text-xs text-neutral-500 mb-2 inline-block bg-neutral-200 px-2 py-0.5 rounded">
                                    Phân loại: {r.colorName}{r.sizeLabel && ` - Size: ${r.sizeLabel}`}
                                </div>
                            )}

                            {/* Nội dung review */}
                            {r.reviewContent && (
                                <p className="text-sm text-neutral-700 mt-1 leading-relaxed">
                                    {r.reviewContent}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
