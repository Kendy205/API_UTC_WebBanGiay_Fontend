import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductById } from '../../redux/actions/user/ProductAction'
import Skeleton from '../loading/Skeleton'
import VariantSelector from './VariantSelector'
import { getProductReviewsThunk } from '../../redux/actions/user/reviewAction'
import ProductReviews from './ProductReviews'

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
    const [activeVariant, setActiveVariant] = useState(null)

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

    // Bắt đúng logic: NẾU có biến thể và giá ghi đè > 0 thì xài nó.
    // NẾU không có (hoặc người dùng mới vào) thì xài salePrice > 0. Nếu không có nốt salePrice thì xài basePrice.
    const displayPrice = (activeVariant && activeVariant.priceOverride > 0) 
        ? activeVariant.priceOverride 
        : (salePrice > 0 ? salePrice : basePrice)
        
    const hasDiscount = basePrice != null && basePrice > 0 && displayPrice < basePrice

    return (
        <div className="rounded-lg border bg-white shadow-sm p-6">
            
            {/* ── Khu vực chi tiết sản phẩm ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* ── Cột Trái: Ảnh sản phẩm ── */}
                <div>
                    <img
                        src={image ?? 'https://placehold.co/800x800?text=No+Image'}
                        alt={productName}
                        className="w-full rounded-lg object-contain bg-neutral-50 border border-neutral-100"
                        style={{ height: '450px' }}
                    />
                </div>

                {/* ── Cột Phải: Thông tin & Đặt hàng ── */}
                <div className="flex flex-col">
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
                                        -{Math.round((1 - displayPrice / basePrice) * 100)}%
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    {/* ── Mô tả ── */}
                    {description && (
                        <p className="mb-6 text-sm leading-relaxed text-neutral-600 border-b border-neutral-100 pb-6">
                            {description}
                        </p>
                    )}

                    {/* ── Chọn biến thể ── */}
                    <div className="mt-8">
                        <VariantSelector variants={variants} baseProduct={product} onVariantChange={setActiveVariant} />
                    </div>
                </div>
            </div>

            {/* ── Khu vực đánh giá ── */}
            <div className="mt-8 pt-6 border-t border-neutral-200">
                <ProductReviews productId={productId} />
            </div>
        </div>
    )
}
