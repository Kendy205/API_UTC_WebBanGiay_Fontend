export default function AdminDashboardPage() {
    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-xl font-semibold text-neutral-900">
                Dashboard (ADMIN)
            </h1>
            <p className="text-neutral-600">
                Đây là nội dung dashboard admin. Sau này bạn có thể thay bằng
                thống kê thật từ API.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded border p-4">
                    <div className="text-sm text-neutral-600">Tổng sản phẩm</div>
                    <div className="mt-1 text-2xl font-semibold text-neutral-900">
                        0
                    </div>
                </div>
                <div className="rounded border p-4">
                    <div className="text-sm text-neutral-600">Tổng đơn</div>
                    <div className="mt-1 text-2xl font-semibold text-neutral-900">
                        0
                    </div>
                </div>
                <div className="rounded border p-4">
                    <div className="text-sm text-neutral-600">Tổng người dùng</div>
                    <div className="mt-1 text-2xl font-semibold text-neutral-900">
                        0
                    </div>
                </div>
            </div>
        </div>
    )
}

