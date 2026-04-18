import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { filterProductsThunk } from '../../redux/actions/user/ProductAction'
import ProductCard from '../../components/shoes/ProductCard'
import Skeleton from '../../components/loading/Skeleton'
import Pagination from '../../components/common/Pagination'

const PAGE_SIZE = 8

const SORT_OPTIONS = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'priceAsc', label: 'Giá: Thấp → Cao' },
    { value: 'priceDesc', label: 'Giá: Cao → Thấp' },
    { value: 'nameAsc', label: 'Tên: A – Z' },
]

// function sortProducts(products, option) {
//     const arr = [...products]
//     if (option === 'priceAsc') return arr.sort((a, b) => (a.salePrice ?? a.basePrice ?? 0) - (b.salePrice ?? b.basePrice ?? 0))
//     if (option === 'priceDesc') return arr.sort((a, b) => (b.salePrice ?? b.basePrice ?? 0) - (a.salePrice ?? a.basePrice ?? 0))
//     if (option === 'nameAsc') return arr.sort((a, b) => (a.productName ?? '').localeCompare(b.productName ?? ''))
//     return arr
// }

export default function SearchResultsPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const keyword = searchParams.get('keyword') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const sortInUrl = searchParams.get('sort') ?? 'newest';

    const [allProducts, setAllProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [totalPages, setTotalPages] = useState(1)
    const [sortOption, setSortOption] = useState('newest')
    const [totalCount, setTotalCount] = useState(0)

    const fetchResults = useCallback(async (kw, pageNum, currentSort) => {
        if (!kw.trim()) {
            setAllProducts([])
            setTotalPages(1)
            return
        }
        setIsLoading(true)
        setError(null)
        try {
            const result = await dispatch(
                filterProductsThunk({
                    keyword: kw.trim(),
                    pageNumber: pageNum, pageSize: PAGE_SIZE, sortBy: currentSort
                })
            ).unwrap()

            // const list = Array.isArray(result?.data) ? result.data
            //     : Array.isArray(result) ? result
            //         : []
            // const total = result?.totalPages ?? result?.totalPage ?? Math.ceil(list.length / PAGE_SIZE) ?? 1
            const pagedData = result?.data || result;
            const list = pagedData?.data || [];
            const totalItems = pagedData?.total || 0;
            const total = Math.ceil(totalItems / PAGE_SIZE);
            setTotalCount(pagedData?.total || 0);
            setAllProducts(list)
            setTotalPages(Math.max(1, total))
        } catch (err) {
            setError(err?.message ?? 'Đã có lỗi xảy ra khi tìm kiếm.')
        } finally {
            setIsLoading(false)
        }
    }, [dispatch])

    // useEffect(() => {
    //     const pageInUrl = searchParams.get('page');

    //     if (keyword && !pageInUrl) {
    //         setSearchParams({ keyword, page: '1' }, { replace: true });
    //     } else {
    //         fetchResults(keyword, page,sortOption);
    //     }
    // }, [keyword, page, sortOption ,searchParams, setSearchParams, fetchResults]);
    useEffect(() => {
        const sortInUrl = searchParams.get('sort');
        if (sortInUrl && sortInUrl !== sortOption) {
            setSortOption(sortInUrl);
        }
        if (keyword && !searchParams.get('page')) {
            setSearchParams({ keyword, page: '1', sort: sortOption }, { replace: true });
        } else {
            fetchResults(keyword, page, sortOption);
        }
    }, [keyword, page, sortOption, searchParams, setSearchParams, fetchResults]);

    const displayProducts = allProducts

    const handlePageChange = (nextPage) => {
        setSearchParams({ keyword, page: String(nextPage), sort: sortOption })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSortOption(newSort);
        setSearchParams({ keyword, page: '1', sort: newSort });
    }
    return (
        <div className="mx-auto max-w-7xl px-4 py-8">

            {/* Tiêu đề */}
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                    Kết quả tìm kiếm
                    {keyword && <span className="ml-2 text-indigo-600">"{keyword}"</span>}
                </h1>
            </div>

            {/* Top bar: nút back + đếm kết quả + sort */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white border border-slate-200/60 p-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                        Trang chủ
                    </button>

                    {isLoading ? (
                        <span className="inline-block h-4 w-32 rounded bg-slate-200 animate-pulse" />
                    ) : keyword ? (
                        <span className="text-sm text-slate-500">
                            Tìm thấy <span className="font-extrabold text-slate-800">{totalCount}</span> sản phẩm
                        </span>
                    ) : null}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 hidden sm:block">Sắp xếp:</span>
                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all appearance-none pr-8"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                        }}
                    >
                        {SORT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="shrink-0 text-red-500">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </svg>
                    <span><strong>Lỗi:</strong> {error}</span>
                </div>
            )}

            {/* Skeleton / Empty / Grid */}
            {!keyword.trim() ? (
                <EmptyState
                    icon="🔍"
                    title="Bắt đầu tìm kiếm"
                    description="Nhập tên sản phẩm, thương hiệu hoặc danh mục vào ô tìm kiếm trên thanh điều hướng."
                />
            ) : isLoading ? (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <li key={i}><Skeleton /></li>
                    ))}
                </ul>
            ) : displayProducts.length === 0 ? (
                <EmptyState
                    icon="📭"
                    title={`Không tìm thấy "${keyword}"`}
                    description="Thử tìm kiếm với từ khoá ngắn hơn hoặc kiểm tra lại chính tả."
                />
            ) : (
                <>
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {displayProducts.map((product) => (
                            <ProductCard
                                key={product.productId ?? product.id}
                                product={product}
                            />
                        ))}
                    </ul>

                    {totalPages > 1 && (
                        <div className="mt-10 flex justify-center pb-6">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function EmptyState({ icon, title, description }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
            <span className="mb-4 text-5xl">{icon}</span>
            <h2 className="mb-2 text-lg font-bold text-slate-800">{title}</h2>
            <p className="max-w-xs text-sm text-slate-500">{description}</p>
        </div>
    )
}