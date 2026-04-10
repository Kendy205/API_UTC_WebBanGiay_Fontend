import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="flex h-10 min-w-[2.5rem] items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Trang trước"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>

            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                const p = i + 1;
                const active = p === currentPage;
                return (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                            active
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-600/20'
                                : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
                        }`}
                    >
                        {p}
                    </button>
                );
            })}

            {totalPages > 7 && (
                <span className="flex h-10 w-10 items-center justify-center text-sm font-medium text-slate-400">…</span>
            )}

            <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="flex h-10 min-w-[2.5rem] items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Trang sau"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
        </div>
    );
}
