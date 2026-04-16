import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../../redux/actions/user/ProductAction';
import ProductCard from './ProductCard';
import Skeleton from '../loading/Skeleton';
import Pagination from '../common/Pagination';

export default function ProductList() {
    const { products, error } = useSelector((state) => state.product)
    const isApiLoading = useSelector((state) => state.ui.loadingCount > 0)

    const dispatch = useDispatch();
    const [page, setPage] = useState(1)
    const pageSize = 12 // Change to 12 for better grid matching (3 or 4 cols)
    const [isPageLoading, setIsPageLoading] = useState(false)

    // States cho Filter & Sort
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)
    const [selectedBrandId, setSelectedBrandId] = useState(null)
    const [sortOption, setSortOption] = useState('newest')

    const goToPage = (nextPage) => {
        setIsPageLoading(true)
        setPage(nextPage)
        setTimeout(() => setIsPageLoading(false), 300)
    }

    const showSkeleton = isPageLoading || isApiLoading

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch])

    // Lấy options danh mục và thương hiệu từ danh sách sản phẩm
    const categories = useMemo(() => {
        if (!products) return []
        const unique = new Map()
        products.forEach(p => {
            if (p.categoryId && p.categoryName) {
                unique.set(p.categoryId, p.categoryName)
            }
        })
        return Array.from(unique.entries()).map(([id, name]) => ({ id, name }))
    }, [products])

    const brands = useMemo(() => {
        if (!products) return []
        const unique = new Map()
        products.forEach(p => {
            if (p.brandId && p.brandName) {
                unique.set(p.brandId, p.brandName)
            }
        })
        return Array.from(unique.entries()).map(([id, name]) => ({ id, name }))
    }, [products])

    // Lọc và Sắp xếp
    const filteredAndSortedProducts = useMemo(() => {
        if (!products) return []
        let result = [...products]

        // Filter
        if (selectedCategoryId) {
            result = result.filter(p => p.categoryId === selectedCategoryId)
        }
        if (selectedBrandId) {
            result = result.filter(p => p.brandId === selectedBrandId)
        }

        // Sort
        if (sortOption === 'priceAsc') {
            result.sort((a, b) => (a.salePrice ?? a.basePrice ?? 0) - (b.salePrice ?? b.basePrice ?? 0))
        } else if (sortOption === 'priceDesc') {
            result.sort((a, b) => (b.salePrice ?? b.basePrice ?? 0) - (a.salePrice ?? a.basePrice ?? 0))
        } else if (sortOption === 'nameAsc') {
            result.sort((a, b) => (a.productName ?? '').localeCompare(b.productName ?? ''))
        }

        return result
    }, [products, selectedCategoryId, selectedBrandId, sortOption])

    const totalItems = filteredAndSortedProducts.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const safePage = Math.min(Math.max(1, page), totalPages)

    const pagedProducts = useMemo(() => {
        const start = (safePage - 1) * pageSize
        return filteredAndSortedProducts.slice(start, start + pageSize)
    }, [filteredAndSortedProducts, safePage])

    // Lắng nghe thay đổi filter để reset về page 1
    useEffect(() => {
        setPage(1)
    }, [selectedCategoryId, selectedBrandId, sortOption])

    return (
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row gap-8 min-h-[calc(100vh-150px)] pb-8 mt-4">
            {/* ======= LEFT SIDEBAR ======= */}
            {isSidebarOpen && (
                <aside className="w-full md:w-64 shrink-0 space-y-6">
                    {/* Thẻ Danh Mục */}
                    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-indigo-500">
                                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                            Danh Mục
                        </h3>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => setSelectedCategoryId(null)}
                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        selectedCategoryId === null ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                                    }`}
                                >
                                    Tất cả sản phẩm
                                    {selectedCategoryId === null && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>}
                                </button>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <button
                                        onClick={() => setSelectedCategoryId(cat.id)}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                            selectedCategoryId === cat.id ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                                        }`}
                                    >
                                        {cat.name}
                                        {selectedCategoryId === cat.id && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Thẻ Thương Hiệu */}
                    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-pink-500">
                                <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v6.086a.5.5 0 0 1-.146.353l-4.915 4.914A.5.5 0 0 1 8.586 14H2.5a.5.5 0 0 1-.5-.5v-11z"/>
                                <path d="M5 5.5A1.5 1.5 0 1 1 6.5 4 1.5 1.5 0 0 1 5 5.5z"/>
                            </svg>
                            Thương Hiệu
                        </h3>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => setSelectedBrandId(null)}
                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        selectedBrandId === null ? 'bg-pink-50 text-pink-700 shadow-sm ring-1 ring-pink-100' : 'text-slate-600 hover:bg-slate-50 hover:text-pink-600'
                                    }`}
                                >
                                    Tất cả thương hiệu
                                    {selectedBrandId === null && <span className="h-1.5 w-1.5 rounded-full bg-pink-500"></span>}
                                </button>
                            </li>
                            {brands.map((brand) => (
                                <li key={brand.id}>
                                    <button
                                        onClick={() => setSelectedBrandId(brand.id)}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                            selectedBrandId === brand.id ? 'bg-pink-50 text-pink-700 shadow-sm ring-1 ring-pink-100' : 'text-slate-600 hover:bg-slate-50 hover:text-pink-600'
                                        }`}
                                    >
                                        {brand.name}
                                        {selectedBrandId === brand.id && <span className="h-1.5 w-1.5 rounded-full bg-pink-500"></span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            )}

            {/* ======= MAIN CONTENT ======= */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Thanh ngang (Top Filter Bar) */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white border border-slate-200/60 p-3 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z" />
                            </svg>
                            {isSidebarOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                        </button>
                        <div className="text-sm text-slate-500 hidden sm:block">
                            Tìm thấy <span className="font-extrabold text-slate-800">{totalItems}</span> sản phẩm
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 hidden sm:block">Sắp xếp:</span>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all appearance-none pr-8"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center' }}
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="priceAsc">Giá: Thấp đến Cao</option>
                            <option value="priceDesc">Giá: Cao đến Thấp</option>
                            <option value="nameAsc">Tên: A - Z</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        Lỗi: {error}
                    </p>
                )}

                {/* Product Grid */}
                {totalItems === 0 && !showSkeleton && !error ? (
                    <div className="flex flex-1 flex-col items-center justify-center py-12 text-center text-neutral-500 bg-white rounded-lg border border-dashed">
                        <span className="text-4xl mb-3">📭</span>
                        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                        <button
                            onClick={() => { setSelectedCategoryId(null); setSelectedBrandId(null); setSortOption('newest') }}
                            className="mt-4 text-sm font-semibold underline hover:text-neutral-900"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {showSkeleton
                            ? Array.from({ length: Math.min(pageSize, 6) }).map((_, idx) => (
                                <li key={idx}>
                                    <Skeleton />
                                </li>
                            ))
                            : pagedProducts.map((product) => (
                                <ProductCard
                                    key={product.productId ?? product.id}
                                    product={product}
                                />
                            ))}
                    </ul>
                )}

                {totalItems > pageSize && (
                    <div className="mt-8 flex justify-center pb-6">
                        <Pagination
                            currentPage={safePage}
                            totalPages={totalPages}
                            onPageChange={goToPage}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
