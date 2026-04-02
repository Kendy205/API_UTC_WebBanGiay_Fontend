import React from 'react'
import LoadingLink from '../loading/LoadingLink'

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

    return (
        <li className="group rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-neutral-900">
                        {name}
                    </h2>
                    {slug && (
                        <p className="mt-1 text-xs text-neutral-500">
                            /{slug}
                        </p>
                    )}
                </div>
                {id != null && (
                    <span className="shrink-0 rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                        #{id}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1 text-sm text-neutral-700">
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

            <div className="mt-4 flex items-center justify-end">
                <LoadingLink
                    to={`/products/${id}`}
                    state={{ product }}
                    className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
                >
                    Xem chi tiết
                </LoadingLink>
            </div>
        </li>
    )
}
