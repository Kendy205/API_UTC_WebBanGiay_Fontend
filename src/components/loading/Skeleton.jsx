import React from 'react'

export default function Skeleton() {
    return (
        // Wrapper copy y hệt ProductCard: li, border, p-4, shadow, bo góc. Bỏ hover, thêm animate-pulse
        <li className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm animate-pulse">
            
            {/* Header: Title + Slug (Trái) & ID (Phải) */}
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="w-full">
                    {/* Giả lập Title (Tên sản phẩm) */}
                    <div className="h-5 w-3/4 rounded bg-neutral-200"></div>
                    {/* Giả lập Slug */}
                    <div className="mt-2 h-3 w-1/2 rounded bg-neutral-200"></div>
                </div>
                {/* Giả lập ID Tag */}
                <div className="h-6 w-10 shrink-0 rounded bg-neutral-200"></div>
            </div>

            {/* Body: Brand + Category */}
            <div className="flex flex-col gap-2">
                {/* Giả lập Hãng */}
                <div className="h-4 w-2/3 rounded bg-neutral-200"></div>
                {/* Giả lập Danh mục */}
                <div className="h-4 w-4/5 rounded bg-neutral-200"></div>
            </div>

            {/* Footer: Nút xem chi tiết */}
            <div className="mt-4 flex items-center justify-end">
                <div className="h-4 w-24 rounded bg-neutral-200"></div>
            </div>
            
        </li>
    )
}