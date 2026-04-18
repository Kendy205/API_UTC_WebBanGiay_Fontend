import { useEffect, useCallback } from 'react'
import LoginFormModal from './LoginFormModal'
import RegisterFormModal from './RegisterFormModal'

/**
 * AuthModal – overlay modal chứa tab Đăng nhập / Đăng ký
 * Props:
 *   isOpen   : boolean
 *   onClose  : () => void
 *   tab      : 'login' | 'register'
 *   setTab   : (tab: 'login' | 'register') => void
 */
export default function AuthModal({ isOpen, onClose, tab, setTab }) {
    // Đóng khi nhấn Escape
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape') onClose()
        },
        [onClose]
    )

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, handleKeyDown])

    if (!isOpen) return null

    return (
        <div
            className="auth-modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            aria-modal="true"
            role="dialog"
            aria-label="Đăng nhập / Đăng ký"
        >
            <div className="auth-modal-card">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="auth-modal-close"
                    aria-label="Đóng"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </button>

                {/* Logo */}
                <div className="auth-modal-logo">
                    <div className="auth-logo-icon">S</div>
                    <span className="auth-logo-text">ShopApp</span>
                </div>

                {/* Tabs */}
                <div className="auth-modal-tabs">
                    <button
                        className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
                        onClick={() => setTab('login')}
                    >
                        Đăng nhập
                    </button>
                    <button
                        className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
                        onClick={() => setTab('register')}
                    >
                        Đăng ký
                    </button>
                    <div className={`auth-tab-indicator ${tab === 'register' ? 'right' : ''}`} />
                </div>

                {/* Form content */}
                <div className="auth-modal-body">
                    {tab === 'login' ? (
                        <LoginFormModal
                            onClose={onClose}
                            onSwitchToRegister={() => setTab('register')}
                        />
                    ) : (
                        <RegisterFormModal
                            onClose={onClose}
                            onSwitchToLogin={() => setTab('login')}
                        />
                    )}
                </div>
            </div>

            <style>{`
                /* ── Shared form styles (always rendered) ── */
                .auth-form-inner {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 20px 24px 24px;
                }
                .auth-field-group { display: flex; flex-direction: column; gap: 5px; }
                .auth-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                }
                .auth-input {
                    width: 100%;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 10px 14px;
                    font-size: 14px;
                    color: #0f172a;
                    background: #f8fafc;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
                    box-sizing: border-box;
                }
                .auth-input:focus {
                    border-color: #6366f1;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                }
                .auth-error {
                    font-size: 12px;
                    color: #ef4444;
                    margin: 0;
                }
                .auth-server-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 13px;
                    color: #dc2626;
                    margin: 0;
                }
                .auth-success-msg {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 13px;
                    color: #16a34a;
                    margin: 0;
                }
                .auth-submit-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    border: none;
                    border-radius: 12px;
                    padding: 12px;
                    font-size: 15px;
                    font-weight: 700;
                    color: #fff;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    cursor: pointer;
                    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
                    margin-top: 4px;
                }
                .auth-submit-btn:hover:not(:disabled) {
                    opacity: 0.92;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(99,102,241,0.45);
                }
                .auth-submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .auth-spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.4);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    flex-shrink: 0;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .auth-switch-text {
                    text-align: center;
                    font-size: 13px;
                    color: #64748b;
                    margin: 0;
                }
                .auth-switch-link {
                    border: none;
                    background: transparent;
                    color: #6366f1;
                    font-weight: 700;
                    cursor: pointer;
                    padding: 0;
                    font-size: 13px;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                .auth-switch-link:hover { color: #4f46e5; }

                /* ── Modal overlay & card ── */
                .auth-modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(15, 23, 42, 0.55);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    animation: authFadeIn 0.2s ease;
                    padding: 16px;
                }

                @keyframes authFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                .auth-modal-card {
                    position: relative;
                    background: #ffffff;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 440px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow:
                        0 25px 60px rgba(0, 0, 0, 0.18),
                        0 4px 16px rgba(99, 102, 241, 0.12);
                    animation: authSlideUp 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
                    scrollbar-width: none;
                }

                .auth-modal-card::-webkit-scrollbar { display: none; }

                @keyframes authSlideUp {
                    from { opacity: 0; transform: translateY(32px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }

                .auth-modal-close {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    border: none;
                    background: #f1f5f9;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.15s, color 0.15s, transform 0.15s;
                    z-index: 10;
                }
                .auth-modal-close:hover {
                    background: #e2e8f0;
                    color: #0f172a;
                    transform: rotate(90deg);
                }

                .auth-modal-logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 28px 24px 0;
                }
                .auth-logo-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 20px;
                    color: #fff;
                    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
                }
                .auth-logo-text {
                    font-size: 20px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                    color: #0f172a;
                }

                /* Tabs */
                .auth-modal-tabs {
                    position: relative;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0;
                    margin: 20px 24px 0;
                    background: #f1f5f9;
                    border-radius: 12px;
                    padding: 4px;
                    overflow: hidden;
                }
                .auth-tab-btn {
                    position: relative;
                    z-index: 2;
                    border: none;
                    background: transparent;
                    padding: 9px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    border-radius: 9px;
                    transition: color 0.2s;
                }
                .auth-tab-btn.active { color: #0f172a; }
                .auth-tab-indicator {
                    position: absolute;
                    z-index: 1;
                    top: 4px;
                    left: 4px;
                    width: calc(50% - 4px);
                    bottom: 4px;
                    background: #fff;
                    border-radius: 9px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .auth-tab-indicator.right {
                    transform: translateX(calc(100% + 0px));
                }

                .auth-modal-body {
                    padding: 4px 0 8px;
                }
            `}</style>
        </div>
    )
}
