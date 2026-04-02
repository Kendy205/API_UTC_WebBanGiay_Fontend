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

export default function RegisterForm() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { error, isAuthenticated, role } = useSelector((s) => s.auth)
    const isLoading = useSelector((s) => s.ui.loadingCount > 0)
    const [successMessage, setSuccessMessage] = useState(null)

    return (
        <div className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center px-4">
            <h1 className="mb-6 text-center text-2xl font-semibold text-neutral-900">
                Đăng ký
            </h1>

            <Formik
                initialValues={{
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                }}
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

                        const message =
                            result?.message ||
                            'Đăng ký thành công. Vui lòng chờ...'
                        setSuccessMessage(message)

                        const r = String(result.role ?? '').toUpperCase()
                        const isAdmin =
                            r === ROLE_ADMIN || r === 'ADMINISTRATOR'

                        // Nếu API trả token thì xem như đăng ký xong đã login
                        if (result?.accessToken) {
                            navigateWithRouteLoading({
                                dispatch,
                                navigate,
                                to: isAdmin ? '/admin' : '/home',
                                options: { replace: true },
                            })
                        } else {
                            // Không trả token -> đưa về trang login để user tự đăng nhập
                            navigateWithRouteLoading({
                                dispatch,
                                navigate,
                                to: '/',
                                options: { replace: true },
                            })
                        }

                        resetForm()
                    } catch {
                        /* lỗi đã vào Redux auth.error */
                    } finally {
                        setSubmitting(false)
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-neutral-700"
                            >
                                Email
                            </label>
                            <Field
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="w-full rounded border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500"
                                placeholder="you@example.com"
                            />
                            <ErrorMessage
                                name="email"
                                component="p"
                                className="mt-1 text-sm text-red-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-1 block text-sm font-medium text-neutral-700"
                            >
                                Số điện thoại
                            </label>
                            <Field
                                id="phone"
                                name="phone"
                                type="text"
                                autoComplete="tel"
                                className="w-full rounded border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500"
                                placeholder="09xxxxxxxx"
                            />
                            <ErrorMessage
                                name="phone"
                                component="p"
                                className="mt-1 text-sm text-red-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm font-medium text-neutral-700"
                            >
                                Mật khẩu
                            </label>
                            <Field
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                className="w-full rounded border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500"
                                placeholder="••••••••"
                            />
                            <ErrorMessage
                                name="password"
                                component="p"
                                className="mt-1 text-sm text-red-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-1 block text-sm font-medium text-neutral-700"
                            >
                                Xác nhận mật khẩu
                            </label>
                            <Field
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                className="w-full rounded border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500"
                                placeholder="••••••••"
                            />
                            <ErrorMessage
                                name="confirmPassword"
                                component="p"
                                className="mt-1 text-sm text-red-600"
                            />
                        </div>

                        {error && (
                            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        {successMessage && !error && (
                            <p className="rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                                {successMessage}
                                {isAuthenticated && role
                                    ? ` — vai trò: ${role}`
                                    : ''}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || isSubmitting}
                            className="rounded bg-neutral-900 px-4 py-2.5 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading || isSubmitting
                                ? 'Đang xử lý…'
                                : 'Đăng ký'}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigateWithRouteLoading({
                                    dispatch,
                                    navigate,
                                    to: '/',
                                    options: { replace: true },
                                })
                            }
                            className="mt-1 rounded border border-neutral-300 px-4 py-2.5 font-medium text-neutral-900 transition hover:bg-neutral-50"
                        >
                            Đã có tài khoản? Đăng nhập
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

