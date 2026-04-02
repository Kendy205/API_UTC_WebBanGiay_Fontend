import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { productService } from '../../services/ProductService'
import Skeleton from '../loading/Skeleton'
import VariantSelector from './VariantSelector'

export default function ProductDetail() {
    const { productId } = useParams()
    const location = useLocation()
    const baseProduct = location.state?.product
    console.log(baseProduct)
    const [variants, setVariants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let ignore = false
        const load = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await productService.getProductVariants(productId)
                const body = res.data
                const data = Array.isArray(body?.data) ? body.data : []
                if (!ignore) setVariants(data)
            } catch (e) {
                if (!ignore) {
                    setError(e.message ?? 'Không tải được biến thể sản phẩm')
                }
            } finally {
                if (!ignore) setLoading(false)
            }
        }
        load()
        return () => {
            ignore = true
        }
    }, [productId])

    const title =
        baseProduct?.productName ??
        baseProduct?.name ??
        `Sản phẩm #${productId}`

    if (loading) {
        return (
            <div className="space-y-3">
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </div>
        )
    }

    if (error) {
        return (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Lỗi: {error}
            </p>
        )
    }

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            {/* ── Header sản phẩm ── */}
            <div className="mb-1 flex items-start justify-between gap-3">
                <h1 className="text-xl font-semibold text-neutral-900">
                    {title}
                </h1>
                {baseProduct?.productId && (
                    <span className="shrink-0 rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
                        #{baseProduct.productId}
                    </span>
                )}
            </div>

            {/* Meta: hãng & danh mục */}
            {(baseProduct?.brandName || baseProduct?.categoryName) && (
                <p className="mb-5 text-sm text-neutral-500">
                    {baseProduct.brandName && (
                        <span>Hãng: {baseProduct.brandName}</span>
                    )}
                    {baseProduct.brandName && baseProduct.categoryName && (
                        <span className="mx-2">•</span>
                    )}
                    {baseProduct.categoryName && (
                        <span>Danh mục: {baseProduct.categoryName}</span>
                    )}
                </p>
            )}

            <hr className="mb-5 border-neutral-200" />

            {/* ── Chọn biến thể ── */}
            <VariantSelector variants={variants} baseProduct={baseProduct} />
        </div>
    )
}
