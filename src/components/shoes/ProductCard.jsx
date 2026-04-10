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
        <li className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:-translate-x-0.5 hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-200">
            <Link to={`/products/${id}`} state={{ product }} className="mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 block relative">
                <img 
                    src={image} 
                    alt={name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"/>
            </Link>

            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-bold text-slate-800 line-clamp-2 transition-colors group-hover:text-indigo-600">
                        {name}
                    </h2>
                    {slug && (
                        <p className="mt-1 text-xs text-slate-500 truncate max-w-[200px]">
                            /{slug}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1.5 text-xs text-slate-600 flex-1 mb-2">
                {brandName && (
                    <div className="flex items-center gap-1.5">
                        <span className="flex h-5 items-center rounded bg-slate-100 px-2 font-medium text-slate-700">{brandName}</span>
                    </div>
                )}
                {categoryName && (
                    <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/></svg>
                        {categoryName}
                    </div>
                )}
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                {displayPrice != null ? (
                    <div className="font-extrabold text-indigo-600 text-[15px]">
                        {formatPrice(displayPrice)}
                    </div>
                ) : <div/>}
                
                <Link
                    to={`/products/${id}`}
                    state={{ product }}
                    className="group/btn flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold tracking-wide text-white transition-all duration-300 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                >
                    Chi tiết
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>
        </li>
    )
}
