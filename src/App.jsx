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
import { Provider } from 'react-redux'
import { store } from './redux/store'

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
                        </Route>
                    </Route>


                </Routes>
            </Provider>
        </>
    )
}

export default App
