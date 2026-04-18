import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { register } from '../../redux/actions/authAction'
import { clearAuthError } from '../../redux/slices/authSlice'
import { ROLE_ADMIN } from '../../utils/constants/System'
import { navigateWithRouteLoading } from '../../utils/route/navigateWithRouteLoading'

const validationSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
    phone: Yup.string()
        .trim()
        .required('Vui lòng nhập số điện thoại')
        .min(8, 'Số điện thoại không hợp lệ'),
    password: Yup.string()
        .min(6, 'Mật khẩu tối thiểu 6 ký tự')
        .required('Vui lòng nhập mật khẩu'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
})

/**
 * RegisterFormModal - dùng trong AuthModal
 * Props:
 *   onClose        : () => void  – đóng modal
 *   onSwitchToLogin: () => void  – chuyển sang tab đăng nhập
 */
export default function RegisterFormModal({ onClose, onSwitchToLogin }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { error } = useSelector((s) => s.auth)
    const isLoading = useSelector((s) => s.ui.loadingCount > 0)
    const [successMessage, setSuccessMessage] = useState(null)

    return (
        <Formik
            initialValues={{ email: '', phone: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            validateOnBlur
            validateOnChange={false}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSuccessMessage(null)
                dispatch(clearAuthError())
                try {
                    const result = await dispatch(
                        register({
                            email: values.email,
                            phone: values.phone,
                            password: values.password,
                        })
                    ).unwrap()

                    const message = result?.message || 'Đăng ký thành công!'
                    setSuccessMessage(message)

                    const r = String(result.role ?? '').toUpperCase()
                    const isAdmin = r === ROLE_ADMIN || r === 'ADMINISTRATOR'

                    if (result?.accessToken) {
                        onClose()
                        navigateWithRouteLoading({
                            dispatch,
                            navigate,
                            to: isAdmin ? '/admin' : '/home',
                            options: { replace: true },
                        })
                    } else {
                        // Không có token → chuyển sang tab login
                        resetForm()
                        setTimeout(() => onSwitchToLogin(), 1200)
                    }
                } catch {
                    /* lỗi vào Redux auth.error */
                } finally {
                    setSubmitting(false)
                }
            }}
        >
            {({ isSubmitting }) => (
                <Form className="auth-form-inner">
                    <div className="auth-field-group">
                        <label htmlFor="reg-email" className="auth-label">Email</label>
                        <Field
                            id="reg-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="auth-input"
                            placeholder="you@example.com"
                        />
                        <ErrorMessage name="email" component="p" className="auth-error" />
                    </div>

                    <div className="auth-field-group">
                        <label htmlFor="reg-phone" className="auth-label">Số điện thoại</label>
                        <Field
                            id="reg-phone"
                            name="phone"
                            type="text"
                            autoComplete="tel"
                            className="auth-input"
                            placeholder="09xxxxxxxx"
                        />
                        <ErrorMessage name="phone" component="p" className="auth-error" />
                    </div>

                    <div className="auth-field-group">
                        <label htmlFor="reg-password" className="auth-label">Mật khẩu</label>
                        <Field
                            id="reg-password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            className="auth-input"
                            placeholder="••••••••"
                        />
                        <ErrorMessage name="password" component="p" className="auth-error" />
                    </div>

                    <div className="auth-field-group">
                        <label htmlFor="reg-confirm" className="auth-label">Xác nhận mật khẩu</label>
                        <Field
                            id="reg-confirm"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            className="auth-input"
                            placeholder="••••••••"
                        />
                        <ErrorMessage name="confirmPassword" component="p" className="auth-error" />
                    </div>

                    {error && (
                        <p className="auth-server-error">{error}</p>
                    )}

                    {successMessage && !error && (
                        <p className="auth-success-msg">✓ {successMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className="auth-submit-btn"
                    >
                        {isLoading || isSubmitting ? <span className="auth-spinner" /> : null}
                        {isLoading || isSubmitting ? 'Đang xử lý…' : 'Tạo tài khoản'}
                    </button>

                    <p className="auth-switch-text">
                        Đã có tài khoản?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="auth-switch-link"
                        >
                            Đăng nhập
                        </button>
                    </p>

                </Form>
            )}
        </Formik>
    )
}
