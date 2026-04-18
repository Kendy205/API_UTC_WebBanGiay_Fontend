import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../../redux/actions/authAction'
import { clearAuthError } from '../../redux/slices/authSlice'
import { ROLE_ADMIN } from '../../utils/constants/System'
import { navigateWithRouteLoading } from '../../utils/route/navigateWithRouteLoading'

const validationSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
    password: Yup.string()
        .min(6, 'Mật khẩu tối thiểu 6 ký tự')
        .required('Vui lòng nhập mật khẩu'),
})

/**
 * LoginFormModal - dùng trong AuthModal
 * Props:
 *   onClose           : () => void  – đóng modal khi đăng nhập thành công
 *   onSwitchToRegister: () => void  – chuyển sang tab đăng ký
 */
export default function LoginFormModal({ onClose, onSwitchToRegister }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { error } = useSelector((s) => s.auth)
    const isLoading = useSelector((s) => s.ui.loadingCount > 0)

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            validateOnBlur
            validateOnChange={false}
            onSubmit={async (values, { setSubmitting }) => {
                dispatch(clearAuthError())
                try {
                    const result = await dispatch(login(values)).unwrap()
                    const r = String(result.role ?? '').toUpperCase()
                    const isAdmin = r === ROLE_ADMIN || r === 'ADMIN'
                    onClose()
                    navigateWithRouteLoading({
                        dispatch,
                        navigate,
                        to: isAdmin ? '/admin' : '/home',
                        options: { replace: true },
                    })
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
                        <label htmlFor="modal-email" className="auth-label">
                            Email
                        </label>
                        <Field
                            id="modal-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="auth-input"
                            placeholder="you@example.com"
                        />
                        <ErrorMessage name="email" component="p" className="auth-error" />
                    </div>

                    <div className="auth-field-group">
                        <label htmlFor="modal-password" className="auth-label">
                            Mật khẩu
                        </label>
                        <Field
                            id="modal-password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            className="auth-input"
                            placeholder="••••••••"
                        />
                        <ErrorMessage name="password" component="p" className="auth-error" />
                    </div>

                    {error && (
                        <p className="auth-server-error">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className="auth-submit-btn"
                    >
                        {isLoading || isSubmitting ? (
                            <span className="auth-spinner" />
                        ) : null}
                        {isLoading || isSubmitting ? 'Đang xử lý…' : 'Đăng nhập'}
                    </button>

                    <p className="auth-switch-text">
                        Chưa có tài khoản?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            className="auth-switch-link"
                        >
                            Đăng ký ngay
                        </button>
                    </p>

                </Form>
            )}
        </Formik>
    )
}
