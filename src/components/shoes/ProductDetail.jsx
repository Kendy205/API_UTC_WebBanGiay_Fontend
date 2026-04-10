import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductById } from '../../redux/actions/ProductAction'
import Skeleton from '../loading/Skeleton'
import VariantSelector from './VariantSelector'
import { getProductReviewsThunk } from '../../redux/actions/reviewAction'

function ProductReviews({ productId }) {
    const dispatch = useDispatch()
    const { reviews, loadingReviews: loading } = useSelector(state => state.review)

    useEffect(() => {
        if (productId) {
            dispatch(getProductReviewsThunk(productId))
        }
    }, [productId, dispatch])

    if (loading) return <div className="mt-8 text-neutral-500">Đang tải đánh giá...</div>

    return (
        <div className="mt-8 pt-8 border-t border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Đánh giá sản phẩm ({reviews.length})</h3>
            {reviews.length === 0 ? (
                <p className="text-sm text-neutral-500">Chưa có đánh giá nào cho sản phẩm này.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((r, idx) => (
                        <div key={idx} className="bg-neutral-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex text-yellow-400 text-sm">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i}>{i < r.rating ? '★' : '☆'}</span>
                                    ))}
                                </div>
                                {r.username && <span className="font-medium text-sm ml-2">{r.username}</span>}
                                {r.createdAt && <span className="text-xs text-neutral-400 ml-auto">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</span>}
                            </div>
                            {(r.colorName || r.sizeLabel) && (
                                <div className="text-xs text-neutral-500 mb-2 inline-block bg-neutral-200 px-2 py-0.5 rounded">
                                    Phân loại: {r.colorName} {r.sizeLabel && `- Size: ${r.sizeLabel}`}
                                </div>
                            )}
                            <p className="text-sm text-neutral-700">{r.reviewContent}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


/**
 * ProductDetail
 * Gọi API getProductById để lấy toàn bộ thông tin sản phẩm + variants.
 * API response shape:
 *   data.data = {
 *     productId, productName, slug, description,
 *     basePrice, salePrice, image,
 *     categoryName, brandName,
 *     variants: [{ variantId, sku, priceOverride, stockQuantity, isActive,
 *                  sizeLabel, sizeSystem, colorName, productName }]
 *   }
 */
export default function ProductDetail() {
    const { productId } = useParams()
    const dispatch = useDispatch()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let ignore = false
        const load = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await dispatch(getProductById(productId))
                // res.payload = response.data từ ProductAction (= { success, statusCode, data })
                const body = res?.payload ?? res?.data
                const data = body?.data ?? body
                if (!ignore) setProduct(data ?? null)
            } catch (e) {
                if (!ignore) setError(e.message ?? 'Không tải được sản phẩm')
            } finally {
                if (!ignore) setLoading(false)
            }
        }
        load()
        return () => { ignore = true }
    }, [productId])

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="space-y-3">
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </div>
        )
    }

    /* ── Error ── */
    if (error) {
        return (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Lỗi: {error}
            </p>
        )
    }

    /* ── Không có dữ liệu ── */
    if (!product) {
        return (
            <p className="rounded border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500">
                Không tìm thấy sản phẩm.
            </p>
        )
    }

    const {
        productName,
        productId: pid,
        slug,
        description,
        basePrice,
        salePrice,
        image,
        brandName,
        categoryName,
        variants = [],
    } = product

    /* ── Format tiền ── */
    const formatPrice = (amount) =>
        amount != null
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
            : null

    const displayPrice = salePrice ?? basePrice
    const hasDiscount = salePrice != null && basePrice != null && salePrice < basePrice

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">

            {/* ── Ảnh sản phẩm ── */}
            <img
                src={image ?? 'https://placehold.co/800x600?text=No+Image'}
                alt={productName}
                className="mb-5 w-full rounded-lg object-cover bg-neutral-100"
                style={{ maxHeight: 360 }}
            />

            {/* ── Header ── */}
            <div className="mb-1 flex items-start justify-between gap-3">
                <h1 className="text-xl font-semibold text-neutral-900">
                    {productName ?? `Sản phẩm #${productId}`}
                </h1>
                {pid != null && (
                    <span className="shrink-0 rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
                        #{pid}
                    </span>
                )}
            </div>

            {/* Slug */}
            {slug && (
                <p className="mb-2 text-xs text-neutral-400">/{slug}</p>
            )}

            {/* ── Meta: hãng & danh mục ── */}
            {(brandName || categoryName) && (
                <p className="mb-3 text-sm text-neutral-500">
                    {brandName && <span>Hãng: <span className="font-medium text-neutral-700">{brandName}</span></span>}
                    {brandName && categoryName && <span className="mx-2">•</span>}
                    {categoryName && <span>Danh mục: <span className="font-medium text-neutral-700">{categoryName}</span></span>}
                </p>
            )}

            {/* ── Giá ── */}
            {displayPrice != null && (
                <div className="mb-4 flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-neutral-900">
                        {formatPrice(displayPrice)}
                    </span>
                    {hasDiscount && (
                        <>
                            <span className="text-sm text-neutral-400 line-through">
                                {formatPrice(basePrice)}
                            </span>
                            <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                                -{Math.round((1 - salePrice / basePrice) * 100)}%
                            </span>
                        </>
                    )}
                </div>
            )}

            {/* ── Mô tả ── */}
            {description && (
                <p className="mb-5 text-sm leading-relaxed text-neutral-600">
                    {description}
                </p>
            )}

            <hr className="mb-5 border-neutral-200" />

            {/* ── Chọn biến thể ── */}
            <VariantSelector variants={variants} baseProduct={product} />

            {/* ── Danh sách đánh giá ── */}
            <ProductReviews productId={pid} />
        </div>
    )
}
