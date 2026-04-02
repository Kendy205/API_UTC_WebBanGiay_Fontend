import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCartThunk } from '../../redux/actions/cartAction'
import { useNavigate } from 'react-router-dom'

/**
 * VariantSelector
 * Props:
 *   - variants: mảng variant từ API  { variantId, sku, colorName, sizeName, stockQuantity, isActive, ... }
 *   - baseProduct: thông tin sản phẩm gốc từ location.state (productName, brandName, categoryName, ...)
 */
export default function VariantSelector({ variants = [], baseProduct = {} }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
    console.log(variants)
    // --- Tập hợp màu duy nhất ---
    const colors = useMemo(() => {
        const seen = new Set()
        return variants
            .filter((v) => v.isActive !== false && v.colorName)
            .reduce((acc, v) => {
                if (!seen.has(v.colorName)) {
                    seen.add(v.colorName)
                    acc.push(v.colorName)
                }
                return acc
            }, [])
    }, [variants])

    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('')

    const maxStock = selectedVariant?.stockQuantity ?? 99

    const handleQtyDecrement = () => setQuantity((q) => Math.max(1, q - 1))
    const handleQtyIncrement = () => setQuantity((q) => Math.min(maxStock, q + 1))
    const handleQtyChange = (e) => {
        const v = Number(e.target.value)
        if (!isNaN(v)) setQuantity(Math.min(maxStock, Math.max(1, v)))
    }

    // --- Tập hợp size theo màu đang chọn ---
    const sizesForColor = useMemo(() => {
        if (!selectedColor) return []
        return variants.filter(
            (v) => v.isActive !== false && v.colorName === selectedColor
        )
    }, [variants, selectedColor])

    const handleColorClick = (color) => {
        if (selectedColor === color) return
        setSelectedColor(color)
        setSelectedVariant(null)
        setQuantity(1)
        setStatus('idle')
        setErrorMsg('')
    }

    const handleSizeClick = (variant) => {
        setSelectedVariant(variant)
        setQuantity(1)
        setStatus('idle')
        setErrorMsg('')
    }

    const handleAddToCart = async () => {
        // Chưa đăng nhập → điều hướng đến trang login
        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        if (!selectedVariant) return

        setStatus('loading')
        setErrorMsg('')

        const result = await dispatch(
            addToCartThunk({
                ...baseProduct,
                ...selectedVariant,
                quantity,
            })
        )

        if (addToCartThunk.rejected.match(result)) {
            setStatus('error')
            setErrorMsg(result.payload ?? 'Có lỗi xảy ra')
        } else {
            setStatus('success')
            setTimeout(() => setStatus('idle'), 2000)
        }
    }

    // --- Tồn kho badge ---
    const stockBadge = () => {
        if (!selectedVariant) return null
        const qty = selectedVariant.stockQuantity ?? 0
        if (qty === 0)
            return (
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    Hết hàng
                </span>
            )
        if (qty < 10)
            return (
                <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Còn {qty} sản phẩm
                </span>
            )
        return (
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Còn hàng ({qty})
            </span>
        )
    }

    // --- Label nút Add to Cart ---
    const btnLabel = () => {
        if (!isAuthenticated) return '🔒 Đăng nhập để mua hàng'
        if (status === 'loading') return 'Đang thêm...'
        if (status === 'success') return '✓ Đã thêm vào giỏ!'
        if (!selectedColor) return 'Chọn màu sắc'
        if (!selectedVariant) return 'Chọn size'
        if ((selectedVariant.stockQuantity ?? 0) === 0) return 'Hết hàng'
        return 'Thêm vào giỏ hàng'
    }

    const btnDisabled =
        status === 'loading' ||
        status === 'success' ||
        (!isAuthenticated
            ? false // không disabled — click sẽ redirect login
            : !selectedVariant || (selectedVariant.stockQuantity ?? 0) === 0)

    if (!variants.length) {
        return (
            <p className="text-sm text-neutral-500">
                Sản phẩm hiện chưa có biến thể.
            </p>
        )
    }

    return (
        <div className="space-y-5">
            {/* ── Chưa đăng nhập: banner nhắc nhở ── */}
            {!isAuthenticated && (
                <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <span>🔒</span>
                    <span>
                        Bạn cần{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="font-semibold underline underline-offset-2 hover:text-amber-900"
                        >
                            đăng nhập
                        </button>{' '}
                        để thêm sản phẩm vào giỏ hàng.
                    </span>
                </div>
            )}

            {/* ── Chọn màu ── */}
            <div>
                <p className="mb-2 text-sm font-medium text-neutral-700">
                    Màu sắc
                    {selectedColor && (
                        <span className="ml-2 font-semibold text-neutral-900">
                            — {selectedColor}
                        </span>
                    )}
                </p>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => handleColorClick(color)}
                            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition
                                ${selectedColor === color
                                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                                    : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500'
                                }`}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Chọn size (chỉ hiện khi đã chọn màu) ── */}
            {selectedColor && (
                <div>
                    <p className="mb-2 text-sm font-medium text-neutral-700">
                        Size
                        {selectedVariant && (
                            <span className="ml-2 font-semibold text-neutral-900">
                                — {selectedVariant.sizeName}
                            </span>
                        )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {sizesForColor.map((v) => {
                            const outOfStock = (v.stockQuantity ?? 0) === 0
                            const isSelected =
                                selectedVariant?.variantId === v.variantId
                            return (
                                <button
                                    key={v.variantId}
                                    type="button"
                                    onClick={() =>
                                        !outOfStock && handleSizeClick(v)
                                    }
                                    disabled={outOfStock}
                                    title={
                                        outOfStock
                                            ? 'Hết hàng'
                                            : `Tồn kho: ${v.stockQuantity}`
                                    }
                                    className={`relative min-w-[52px] rounded border px-4 py-1.5 text-sm font-medium transition
                                        ${isSelected
                                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                                            : outOfStock
                                                ? 'cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400 line-through'
                                                : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500'
                                        }`}
                                >
                                    {v.sizeName}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── Thông tin tồn kho + SKU ── */}
            {selectedVariant && (
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                    <div className="text-sm text-neutral-600">
                        <span className="font-medium text-neutral-800">
                            SKU:
                        </span>{' '}
                        {selectedVariant.sku}
                    </div>
                    <div className="h-4 w-px bg-neutral-300" />
                    <div className="text-sm text-neutral-600">
                        <span className="font-medium text-neutral-800">
                            Tồn kho:
                        </span>{' '}
                        {stockBadge()}
                    </div>
                </div>
            )}

            {/* ── Chọn số lượng (chỉ hiện khi đã chọn variant còn hàng) ── */}
            {selectedVariant && (selectedVariant.stockQuantity ?? 0) > 0 && (
                <div>
                    <p className="mb-2 text-sm font-medium text-neutral-700">Số lượng</p>
                    <div className="flex items-center gap-0 w-fit rounded-lg border border-neutral-300 overflow-hidden">
                        <button
                            type="button"
                            onClick={handleQtyDecrement}
                            disabled={quantity <= 1}
                            className="h-9 w-9 flex items-center justify-center text-lg font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            min={1}
                            max={maxStock}
                            value={quantity}
                            onChange={handleQtyChange}
                            className="h-9 w-14 border-x border-neutral-300 text-center text-sm font-semibold text-neutral-900 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleQtyIncrement}
                            disabled={quantity >= maxStock}
                            className="h-9 w-9 flex items-center justify-center text-lg font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            +
                        </button>
                    </div>
                    {maxStock < 10 && (
                        <p className="mt-1 text-xs text-amber-600">Tối đa {maxStock} sản phẩm</p>
                    )}
                </div>
            )}

            {/* ── Lỗi (ví dụ: chưa login, API lỗi) ── */}
            {status === 'error' && errorMsg && (
                <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errorMsg}
                </p>
            )}

            {/* ── Nút thêm vào giỏ ── */}
            <button
                type="button"
                onClick={handleAddToCart}
                disabled={btnDisabled}
                className={`w-full rounded-lg px-6 py-3 text-sm font-semibold transition
                    ${status === 'success'
                        ? 'bg-green-600 text-white'
                        : !isAuthenticated
                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                            : 'bg-neutral-900 text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40'
                    }`}
            >
                {btnLabel()}
            </button>
        </div>
    )
}
