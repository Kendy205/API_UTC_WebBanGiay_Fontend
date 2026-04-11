import { Routes, Route } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import ProtectedRoute from './utils/route/ProtectedRoute'
import UserTemplate from './templates/UserTemplate'
import AdminTemplate from './templates/AdminTemplate'
import HomePage from './pages/home/HomePage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import Loading from './components/loading/Loading'
import ProductList from './components/shoes/ProductList'
import CartPage from './pages/cart/CartPage'
import ProductDetail from './components/shoes/ProductDetail'
import OrderPage from './pages/order/OrderPage'
import OrderHistoryPage from './pages/order/OrderHistoryPage'
import SearchResultsPage from './pages/search/SearchResultsPage'
import VnpayReturnPage from './pages/order/VnpayReturnPage'
import { Provider } from 'react-redux'
import { store } from './redux/store'

// Admin pages
import AnalyticsPage from './pages/admin/analytics/AnalyticsPage'
import ReportsPage from './pages/admin/reports/ReportsPage'
import ProductsAdminPage from './pages/admin/products/ProductsAdminPage'
import CategoriesPage from './pages/admin/categories/CategoriesPage'
import InventoryPage from './pages/admin/inventory/InventoryPage'
import PromotionsPage from './pages/admin/promotions/PromotionsPage'
import OrdersAdminPage from './pages/admin/orders/OrdersAdminPage'
import PaymentsPage from './pages/admin/payments/PaymentsPage'
import RefundsPage from './pages/admin/refunds/RefundsPage'
import CustomersPage from './pages/admin/customers/CustomersPage'
import ReviewsAdminPage from './pages/admin/reviews/ReviewsAdminPage'
import SettingsPage from './pages/admin/settings/SettingsPage'
import LogsPage from './pages/admin/logs/LogsPage'

function App() {
    return (
        <>
            <Provider store={store}>
                <Loading />
                <Routes>

                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />

                    <Route path="" element={<UserTemplate />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/search" element={<SearchResultsPage />} />
                        {/* <Route path="/products" element={<ProductList />} /> */}
                        <Route path="/products/:productId" element={<ProductDetail />} />
                        {/* Auth: USER */}
                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={['USER', 'CUSTOMER']}
                                />
                            }
                        >
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/order" element={<OrderPage />} />
                            <Route path="/order-history" element={<OrderHistoryPage />} />
                        </Route>
                        {/* Kết quả thanh toán VNPay — không yêu cầu đăng nhập vì VNPay redirect */}
                        <Route path="/vnpay-return" element={<VnpayReturnPage />} />
                    </Route>


                    {/* Auth: ADMIN */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={['ADMIN', 'ADMINISTRATOR']}
                            />
                        }
                    >
                        <Route path="/admin" element={<AdminTemplate />}>
                            <Route index element={<AdminDashboardPage />} />
                            <Route path="analytics" element={<AnalyticsPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                            <Route path="products" element={<ProductsAdminPage />} />
                            <Route path="categories" element={<CategoriesPage />} />
                            <Route path="inventory" element={<InventoryPage />} />
                            <Route path="promotions" element={<PromotionsPage />} />
                            <Route path="orders" element={<OrdersAdminPage />} />
                            <Route path="payments" element={<PaymentsPage />} />
                            <Route path="refunds" element={<RefundsPage />} />
                            <Route path="customers" element={<CustomersPage />} />
                            <Route path="reviews" element={<ReviewsAdminPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="logs" element={<LogsPage />} />
                        </Route>
                    </Route>


                </Routes>
            </Provider>
        </>
    )
}

export default App
