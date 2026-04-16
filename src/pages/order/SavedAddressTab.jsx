import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addAddressThunk, deleteAddressThunk } from '../../redux/actions/user/orderAction'

export default function SavedAddressTab({ selectedAddressId, setSelectedAddressId }) {
    const dispatch = useDispatch()
    const { addresses, addressLoading, addressError, addingAddress, addAddressError } = useSelector((s) => s.order)

    const [showAddForm, setShowAddForm] = useState(false)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [newAddressForm, setNewAddressForm] = useState({
        recipientName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        streetAddress: '',
        isDefault: true
    })

    const handleAddressFormChange = (e) => {
        const { name, value, type, checked } = e.target
        setNewAddressForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmitAddress = async (e) => {
        e.preventDefault()
        const res = await dispatch(addAddressThunk(newAddressForm))
        if (!res.error) {
            setShowAddForm(false)
            setNewAddressForm({
                recipientName: '',
                phone: '',
                province: '',
                district: '',
                ward: '',
                streetAddress: '',
                isDefault: true
            })
        }
    }

    const handleDeleteConfirm = async () => {
        if (!confirmDeleteId) return
        setDeleting(true)
        await dispatch(deleteAddressThunk({ addressId: confirmDeleteId.id, addressData: confirmDeleteId.data }))
        setDeleting(false)
        setConfirmDeleteId(null)
        if (selectedAddressId === confirmDeleteId.id) setSelectedAddressId(null)
    }

    if (addressLoading) {
        return <p className="text-sm text-neutral-500">Đang tải địa chỉ…</p>
    }

    return (
        <>
        <div className="space-y-4">
            {addressError && !showAddForm && addresses.length > 0 && (
                <p className="text-sm text-red-600">{addressError}</p>
            )}

            {showAddForm || addresses.length === 0 || addressError ? (
                <form onSubmit={handleSubmitAddress} className="space-y-3 rounded-lg border border-neutral-200 p-4 bg-neutral-50">
                    <h3 className="font-semibold text-neutral-800 mb-2">
                        {addresses.length === 0 ? 'Bạn chưa có địa chỉ nào. Hãy thêm mới:' : 'Thêm địa chỉ mới'}
                    </h3>
                    {addAddressError && <p className="text-sm text-red-600 mb-2">{addAddressError}</p>}
                    {addressError && addresses.length === 0 && <p className="text-sm text-amber-600 mb-2">Không thể tải địa chỉ đã lưu hoặc bạn chưa có địa chỉ. Hãy tạo mới.</p>}

                    <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-700">Tên người nhận</label>
                        <input required type="text" name="recipientName" value={newAddressForm.recipientName} onChange={handleAddressFormChange} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-700">Số điện thoại</label>
                        <input required type="tel" name="phone" value={newAddressForm.phone} onChange={handleAddressFormChange} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-neutral-700">Tỉnh/Thành</label>
                            <input required type="text" name="province" value={newAddressForm.province} onChange={handleAddressFormChange} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-neutral-700">Quận/Huyện</label>
                            <input required type="text" name="district" value={newAddressForm.district} onChange={handleAddressFormChange} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-neutral-700">Phường/Xã</label>
                            <input required type="text" name="ward" value={newAddressForm.ward} onChange={handleAddressFormChange} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-neutral-700">Địa chỉ cụ thể (Số nhà, đường...)</label>
                        <input required type="text" name="streetAddress" value={newAddressForm.streetAddress} onChange={handleAddressFormChange} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none" />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-neutral-700 mt-2">
                        <input type="checkbox" name="isDefault" checked={newAddressForm.isDefault} onChange={handleAddressFormChange} className="accent-neutral-900" />
                        Đặt làm địa chỉ mặc định
                    </label>

                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={addingAddress} className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 transition disabled:opacity-50">
                            {addingAddress ? 'Đang thêm...' : 'Lưu địa chỉ'}
                        </button>
                        {addresses.length > 0 && (
                            <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition">
                                Hủy
                            </button>
                        )}
                    </div>
                </form>
            ) : (
                <div className="space-y-3">
                    {addresses.map((addr) => {
                        const isSelected = addr.addressId === selectedAddressId
                        const fullAddress = [
                            addr.streetAddress,
                            addr.ward,
                            addr.district,
                            addr.province,
                        ]
                            .filter(Boolean)
                            .join(', ')
                        return (
                            <label
                                key={addr.addressId}
                                className={`relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${isSelected
                                    ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                                    : 'border-neutral-200 hover:border-neutral-400'
                                    }`}
                            >
                                {/* Nút xóa góc trên phải */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setConfirmDeleteId({ id: addr.addressId, data: addr })
                                    }}
                                    className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-500 transition"
                                    title="Xóa địa chỉ"
                                >
                                    ✕
                                </button>

                                <input
                                    type="radio"
                                    name="address"
                                    value={addr.addressId}
                                    checked={isSelected}
                                    onChange={() => setSelectedAddressId(addr.addressId)}
                                    className="mt-1 accent-neutral-900"
                                />
                                <div className="text-sm pr-4">
                                    <div className="font-semibold text-neutral-900">
                                        {addr.recipientName}
                                        {addr.isDefault && (
                                            <span className="ml-2 rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                                Mặc định
                                            </span>
                                        )}
                                    </div>
                                    {addr.phone && (
                                        <div className="mt-0.5 text-neutral-600">{addr.phone}</div>
                                    )}
                                    <div className="mt-0.5 text-neutral-600">{fullAddress}</div>
                                </div>
                            </label>
                        )
                    })}
                    <button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        className="w-full rounded-lg border border-dashed border-neutral-300 py-3 text-sm font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition"
                    >
                        + Thêm địa chỉ mới
                    </button>
                </div>
            )}
        </div>

            {/* Modal xác nhận xóa */}
            {confirmDeleteId && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onClick={() => !deleting && setConfirmDeleteId(null)}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-base font-semibold text-neutral-900 mb-2">Xóa địa chỉ?</h3>
                        <p className="text-sm text-neutral-600 mb-5">
                            Bạn có chắc muốn xóa địa chỉ này không? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDeleteConfirm}
                                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-50"
                            >
                                {deleting ? 'Đang xóa...' : 'Xóa'}
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition disabled:opacity-50"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
