// ============================================================
// ADMIN MOCK DATA — Tất cả dữ liệu giả dùng cho admin pages
// Khi backend sẵn sàng: xoá import mockData và dùng Redux state
// ============================================================

// ─── PRODUCTS ────────────────────────────────────────────────
export const MOCK_PRODUCTS = [
    { id: 1, name: 'Nike Air Max 270', price: 1890000, stock: 45, categoryId: 1, categoryName: 'Running', imageUrl: null, isActive: true, sold: 84 },
    { id: 2, name: 'Adidas Ultraboost 22', price: 2450000, stock: 28, categoryId: 1, categoryName: 'Running', imageUrl: null, isActive: true, sold: 67 },
    { id: 3, name: 'Puma RS-X3', price: 1250000, stock: 60, categoryId: 2, categoryName: 'Lifestyle', imageUrl: null, isActive: true, sold: 52 },
    { id: 4, name: 'New Balance 574', price: 1590000, stock: 15, categoryId: 2, categoryName: 'Lifestyle', imageUrl: null, isActive: true, sold: 41 },
    { id: 5, name: 'Converse Chuck 70', price: 980000, stock: 80, categoryId: 2, categoryName: 'Lifestyle', imageUrl: null, isActive: true, sold: 28 },
    { id: 6, name: 'Nike Air Force 1', price: 1750000, stock: 3, categoryId: 2, categoryName: 'Lifestyle', imageUrl: null, isActive: true, sold: 95 },
    { id: 7, name: 'Vans Old Skool', price: 890000, stock: 55, categoryId: 2, categoryName: 'Lifestyle', imageUrl: null, isActive: false, sold: 33 },
    { id: 8, name: 'Asics Gel-Kayano 29', price: 3200000, stock: 20, categoryId: 1, categoryName: 'Running', imageUrl: null, isActive: true, sold: 19 },
]

// ─── CATEGORIES ───────────────────────────────────────────────
export const MOCK_CATEGORIES = [
    { id: 1, name: 'Running', description: 'Giày chạy bộ chuyên dụng', productCount: 3, isActive: true },
    { id: 2, name: 'Lifestyle', description: 'Giày thời trang hàng ngày', productCount: 5, isActive: true },
    { id: 3, name: 'Basketball', description: 'Giày bóng rổ', productCount: 0, isActive: true },
    { id: 4, name: 'Football', description: 'Giày bóng đá', productCount: 0, isActive: false },
    { id: 5, name: 'Training', description: 'Giày tập gym', productCount: 0, isActive: true },
]

// ─── ORDERS ───────────────────────────────────────────────────
export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipping', 'Completed', 'Cancelled']

export const MOCK_ORDERS = [
    { id: 1001, customerName: 'Nguyễn Văn A', total: 1890000, status: 'Completed', createdAt: '2026-04-10T08:30:00', itemCount: 1, paymentMethod: 'COD' },
    { id: 1002, customerName: 'Trần Thị B', total: 2450000, status: 'Shipping', createdAt: '2026-04-10T10:15:00', itemCount: 1, paymentMethod: 'Banking' },
    { id: 1003, customerName: 'Lê Minh C', total: 1250000, status: 'Pending', createdAt: '2026-04-11T07:00:00', itemCount: 1, paymentMethod: 'COD' },
    { id: 1004, customerName: 'Phạm Thị D', total: 3540000, status: 'Confirmed', createdAt: '2026-04-11T07:45:00', itemCount: 2, paymentMethod: 'Banking' },
    { id: 1005, customerName: 'Hoàng Văn E', total: 980000, status: 'Cancelled', createdAt: '2026-04-09T14:20:00', itemCount: 1, paymentMethod: 'COD' },
    { id: 1006, customerName: 'Vũ Thị F', total: 4200000, status: 'Completed', createdAt: '2026-04-08T09:00:00', itemCount: 3, paymentMethod: 'Banking' },
    { id: 1007, customerName: 'Đặng Văn G', total: 1750000, status: 'Shipping', createdAt: '2026-04-09T16:30:00', itemCount: 1, paymentMethod: 'COD' },
]

// ─── CUSTOMERS ────────────────────────────────────────────────
export const MOCK_CUSTOMERS = [
    { id: 1, fullName: 'Nguyễn Văn A', email: 'a@example.com', phone: '0901234567', totalOrders: 5, totalSpent: 9450000, createdAt: '2026-01-15', isActive: true },
    { id: 2, fullName: 'Trần Thị B', email: 'b@example.com', phone: '0912345678', totalOrders: 3, totalSpent: 6200000, createdAt: '2026-02-10', isActive: true },
    { id: 3, fullName: 'Lê Minh C', email: 'c@example.com', phone: '0923456789', totalOrders: 1, totalSpent: 1250000, createdAt: '2026-03-20', isActive: true },
    { id: 4, fullName: 'Phạm Thị D', email: 'd@example.com', phone: '0934567890', totalOrders: 8, totalSpent: 18340000, createdAt: '2025-12-01', isActive: true },
    { id: 5, fullName: 'Hoàng Văn E', email: 'e@example.com', phone: '0945678901', totalOrders: 2, totalSpent: 2730000, createdAt: '2026-04-01', isActive: false },
    { id: 6, fullName: 'Vũ Thị F', email: 'f@example.com', phone: '0956789012', totalOrders: 12, totalSpent: 31800000, createdAt: '2025-10-15', isActive: true },
]


// ─── PROMOTIONS ───────────────────────────────────────────────
export const MOCK_PROMOTIONS = [
    { id: 1, code: 'SUMMER20', discountType: 'Percent', discountValue: 20, minOrderValue: 500000, usedCount: 145, maxUsage: 500, startDate: '2026-04-01', endDate: '2026-04-30', isActive: true },
    { id: 2, code: 'NEWUSER50K', discountType: 'Fixed', discountValue: 50000, minOrderValue: 300000, usedCount: 89, maxUsage: 200, startDate: '2026-01-01', endDate: '2026-12-31', isActive: true },
    { id: 3, code: 'VIP30', discountType: 'Percent', discountValue: 30, minOrderValue: 2000000, usedCount: 12, maxUsage: 50, startDate: '2026-04-01', endDate: '2026-04-15', isActive: false },
    { id: 4, code: 'FREESHIP', discountType: 'Fixed', discountValue: 30000, minOrderValue: 200000, usedCount: 320, maxUsage: 1000, startDate: '2026-03-01', endDate: '2026-06-30', isActive: true },
]

// ─── INVENTORY ────────────────────────────────────────────────
export const MOCK_INVENTORY = [
    { productId: 1, productName: 'Nike Air Max 270', sku: 'NIK-AM270-01', stock: 45, sold: 84, imageUrl: null, lowStockThreshold: 10 },
    { productId: 2, productName: 'Adidas Ultraboost 22', sku: 'ADI-UB22-01', stock: 28, sold: 67, imageUrl: null, lowStockThreshold: 10 },
    { productId: 3, productName: 'Puma RS-X3', sku: 'PUM-RSX3-01', stock: 60, sold: 52, imageUrl: null, lowStockThreshold: 15 },
    { productId: 4, productName: 'New Balance 574', sku: 'NB-574-01', stock: 15, sold: 41, imageUrl: null, lowStockThreshold: 20 },
    { productId: 5, productName: 'Converse Chuck 70', sku: 'CON-C70-01', stock: 80, sold: 28, imageUrl: null, lowStockThreshold: 10 },
    { productId: 6, productName: 'Nike Air Force 1', sku: 'NIK-AF1-01', stock: 3, sold: 95, imageUrl: null, lowStockThreshold: 10 },
    { productId: 7, productName: 'Vans Old Skool', sku: 'VAN-OS-01', stock: 55, sold: 33, imageUrl: null, lowStockThreshold: 10 },
    { productId: 8, productName: 'Asics Gel-Kayano 29', sku: 'ASI-GK29-01', stock: 20, sold: 19, imageUrl: null, lowStockThreshold: 10 },
]

// ─── PAYMENTS ────────────────────────────────────────────────
export const MOCK_PAYMENTS = [
    { id: 'PAY-001', orderId: 1001, customerName: 'Nguyễn Văn A', amount: 1890000, method: 'COD', status: 'Paid', createdAt: '2026-04-10T08:30:00' },
    { id: 'PAY-002', orderId: 1002, customerName: 'Trần Thị B', amount: 2450000, method: 'Banking', status: 'Paid', createdAt: '2026-04-10T10:15:00' },
    { id: 'PAY-003', orderId: 1003, customerName: 'Lê Minh C', amount: 1250000, method: 'COD', status: 'Pending', createdAt: '2026-04-11T07:00:00' },
    { id: 'PAY-004', orderId: 1004, customerName: 'Phạm Thị D', amount: 3540000, method: 'Banking', status: 'Paid', createdAt: '2026-04-11T07:45:00' },
    { id: 'PAY-005', orderId: 1005, customerName: 'Hoàng Văn E', amount: 980000, method: 'COD', status: 'Refunded', createdAt: '2026-04-09T14:20:00' },
    { id: 'PAY-006', orderId: 1006, customerName: 'Vũ Thị F', amount: 4200000, method: 'Banking', status: 'Paid', createdAt: '2026-04-08T09:00:00' },
]

// ─── REFUNDS ─────────────────────────────────────────────────
export const MOCK_REFUNDS = [
    { id: 1, orderId: 1005, customerName: 'Hoàng Văn E', amount: 980000, reason: 'Sản phẩm bị lỗi', status: 'Approved', createdAt: '2026-04-09T15:00:00' },
    { id: 2, orderId: 1008, customerName: 'Bùi Thị H', amount: 1590000, reason: 'Đặt nhầm size', status: 'Pending', createdAt: '2026-04-11T06:30:00' },
    { id: 3, orderId: 1009, customerName: 'Ngô Văn I', amount: 2450000, reason: 'Không nhận được hàng', status: 'Rejected', createdAt: '2026-04-08T11:00:00' },
    { id: 4, orderId: 1010, customerName: 'Lý Thị K', amount: 890000, reason: 'Sản phẩm khác mô tả', status: 'Pending', createdAt: '2026-04-11T08:00:00' },
]

// ─── REVIEWS ─────────────────────────────────────────────────
export const MOCK_REVIEWS = [
    { id: 1, productName: 'Nike Air Max 270', customerName: 'Nguyễn Văn A', rating: 5, comment: 'Giày rất đẹp và thoải mái, giao hàng nhanh!', createdAt: '2026-04-10T09:00:00', isVisible: true },
    { id: 2, productName: 'Adidas Ultraboost 22', customerName: 'Trần Thị B', rating: 4, comment: 'Chất lượng tốt nhưng size hơi to.', createdAt: '2026-04-09T14:00:00', isVisible: true },
    { id: 3, productName: 'Puma RS-X3', customerName: 'Lê Minh C', rating: 2, comment: 'Không như hình, màu sắc khác nhiều.', createdAt: '2026-04-08T10:00:00', isVisible: false },
    { id: 4, productName: 'Nike Air Force 1', customerName: 'Phạm Thị D', rating: 5, comment: 'Tuyệt vời! Đúng như kỳ vọng.', createdAt: '2026-04-07T16:00:00', isVisible: true },
    { id: 5, productName: 'Converse Chuck 70', customerName: 'Vũ Thị F', rating: 3, comment: 'Bình thường, không đặc biệt lắm.', createdAt: '2026-04-06T12:00:00', isVisible: true },
]

// ─── ANALYTICS ───────────────────────────────────────────────
export const MOCK_ANALYTICS_OVERVIEW = {
    totalRevenue: 48200000,
    totalOrders: 1284,
    newCustomers: 312,
    avgOrderValue: 1245000,
    revenueByMonth: [
        { month: 'T1', revenue: 32000000 },
        { month: 'T2', revenue: 28500000 },
        { month: 'T3', revenue: 41200000 },
        { month: 'T4', revenue: 48200000 },
        { month: 'T5', revenue: 0 },
        { month: 'T6', revenue: 0 },
    ],
    ordersByStatus: {
        Pending: 43,
        Confirmed: 127,
        Shipping: 89,
        Completed: 978,
        Cancelled: 47,
    },
}

export const MOCK_REVENUE_CHART = Array.from({ length: 14 }, (_, i) => ({
    date: `04/${(i + 1).toString().padStart(2, '0')}`,
    revenue: Math.floor(Math.random() * 5000000) + 500000,
    orders: Math.floor(Math.random() * 40) + 5,
}))

// ─── REPORTS ─────────────────────────────────────────────────
export const MOCK_REPORTS = {
    summary: {
        totalRevenue: 48200000,
        totalOrders: 1284,
        avgOrderValue: 1245000,
        returnRate: 2.4,
    },
    data: [
        { period: 'Tuần 1 (01/04 - 07/04)', revenue: 11200000, orders: 287, avgValue: 1120000 },
        { period: 'Tuần 2 (08/04 - 14/04)', revenue: 14300000, orders: 345, avgValue: 1298000 },
        { period: 'Tuần 3 (15/04 - 21/04)', revenue: 12800000, orders: 321, avgValue: 1241000 },
        { period: 'Tuần 4 (22/04 - 30/04)', revenue: 9900000, orders: 331, avgValue: 1320000 },
    ],
}

// ─── LOGS ────────────────────────────────────────────────────
export const LOG_LEVELS = ['INFO', 'WARNING', 'ERROR', 'DEBUG']

export const MOCK_LOGS = [
    { id: 1, level: 'INFO', message: 'Admin đăng nhập thành công', userId: 1, createdAt: '2026-04-11T07:30:00' },
    { id: 2, level: 'WARNING', message: 'Sản phẩm #6 sắp hết hàng (còn 3)', userId: null, createdAt: '2026-04-11T07:15:00' },
    { id: 3, level: 'ERROR', message: 'Thanh toán thất bại cho đơn #1003 — Gateway timeout', userId: null, createdAt: '2026-04-11T07:00:00' },
    { id: 4, level: 'INFO', message: 'Cập nhật trạng thái đơn #1002 → Shipping', userId: 1, createdAt: '2026-04-10T16:30:00' },
    { id: 5, level: 'INFO', message: 'Thêm mã khuyến mãi SUMMER20', userId: 1, createdAt: '2026-04-10T09:00:00' },
    { id: 6, level: 'ERROR', message: 'Lỗi xác minh email người dùng #5', userId: 5, createdAt: '2026-04-09T14:00:00' },
    { id: 7, level: 'DEBUG', message: 'Cache invalidated for product list', userId: null, createdAt: '2026-04-09T12:00:00' },
    { id: 8, level: 'WARNING', message: 'Số lần đăng nhập sai quá nhiều — IP 192.168.1.42', userId: null, createdAt: '2026-04-08T22:00:00' },
]

// ─── SETTINGS ────────────────────────────────────────────────
export const MOCK_SETTINGS = {
    siteName: 'ShopApp',
    contactEmail: 'support@shopapp.vn',
    currency: 'VND',
    freeShippingThreshold: 500000,
    maintenanceMode: false,
    allowRegistration: true,
    lowStockThreshold: 10,
    defaultTaxRate: 0,
}
