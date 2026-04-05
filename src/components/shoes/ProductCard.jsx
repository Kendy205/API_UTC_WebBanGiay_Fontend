import React from 'react'
import LoadingLink from '../loading/LoadingLink'
import { Link } from 'react-router-dom'

/**
 * Dumb component: chỉ hiển thị theo props, không gọi API / Redux.
 * Có thể tái dùng ở trang chủ, danh mục, sản phẩm liên quan.
 */
// api get products trả về 1 object như sau:
// {
//     "productId": 1,
//     "categoryId": 8,
//     "brandId": 1,
//     "productName": "Giày Sneaker Cao Cấp Mẫu 1",
//     "slug": "giay-sneaker-cao-cap-mau-1",
//     "categoryName": "Danh mục Giày 8",
//     "brandName": "Nike"
//   }
export default function ProductCard({ product }) {
    if (!product) return null

    const id = product.productId ?? product.id
    const name = product.productName ?? product.name ?? 'Sản phẩm'
    const slug = product.slug ?? ''
    const categoryName = product.categoryName ?? ''
    const brandName = product.brandName ?? ''
    const image = product.image ?? 'https://placehold.co/600x400?text=No+Image'

    const displayPrice = product.salePrice ?? product.basePrice
    const formatPrice = (amount) => amount != null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount) : null

    return (
        <li className="group flex flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
            <Link to={`/products/${id}`} state={{ product }} className="mb-4 aspect-[4/3] overflow-hidden rounded-md bg-neutral-100 block">
                <img 
                    src={image} 
                    alt={name} 
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </Link>

            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-neutral-900 line-clamp-2">
                        {name}
                    </h2>
                    {slug && (
                        <p className="mt-1 text-xs text-neutral-500 truncate max-w-[200px]">
                            /{slug}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1 text-sm text-neutral-700 flex-1">
                {brandName && (
                    <p>
                        <span className="text-neutral-500">Hãng:</span>{' '}
                        {brandName}
                    </p>
                )}
                {categoryName && (
                    <p>
                        <span className="text-neutral-500">Danh mục:</span>{' '}
                        {categoryName}
                    </p>
                )}
            </div>

            {displayPrice != null && (
                <div className="mt-3 font-semibold text-red-600 text-lg">
                    {formatPrice(displayPrice)}
                </div>
            )}

            <div className="mt-4 flex items-center justify-end">
                <Link
                    to={`/products/${id}`}
                    state={{ product }}
                    className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
                >
                    Xem chi tiết
                </Link>
            </div>
        </li>
    )
}
