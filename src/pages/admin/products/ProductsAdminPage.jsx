import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import {
    PageHeader, Btn, Table, SearchBar, Modal, FormField, Input, Select, Toggle,
    badge, fmt,
} from '../adminShared'
import Pagination from '../../../components/common/Pagination'
import { EMPTY, EMPTY_VARIANT } from './ProductsShared'

// Import Thunks
import {
    fetchAdminProductsThunk,
    createAdminProductThunk,
    updateAdminProductThunk,
    deleteAdminProductThunk,
    createAdminVariantThunk,
    updateAdminVariantThunk,
    deleteAdminVariantThunk,
    fetchAdminColorsThunk,
    fetchAdminSizesThunk,
} from '../../../redux/actions/admin/adminProductAction'
import { setPage } from '../../../redux/slices/admin/adminProductSlice'
import { fetchAdminCategoriesThunk } from '../../../redux/actions/admin/adminCategoryAction'
import { fetchAdminBrandsThunk } from '../../../redux/actions/admin/adminBrandAction'

export default function ProductsAdminPage() {
    const dispatch = useDispatch()

    // --- Redux State ---
    const { items, loading, colors, sizes, page, pageSize, totalPages } = useSelector((s) => s.adminProduct)
    const { items: categories } = useSelector((s) => s.adminCategory)
    const { items: brands } = useSelector((s) => s.adminBrand)
    //console.log(brands)
    //console.log(categories)


    const [search, setSearch] = useState('')

    // --- State cho Modal Thông Tin Sản Phẩm ---
    const [modal, setModal] = useState(null) // null | 'add' | 'edit'
    const [form, setForm] = useState(EMPTY)

    // --- State cho Modal Biến Thể ---
    const [variantModalProduct, setVariantModalProduct] = useState(null) // null | object Product (from Redux)
    const [variantsList, setVariantsList] = useState([]) // Mảng các biến thể hiển thị dạng list với metadata tạm

    // Fetch dữ liệu ban đầu
    useEffect(() => {
        dispatch(fetchAdminProductsThunk({ page, pageSize }))
    }, [dispatch, page, pageSize])

    useEffect(() => {
        dispatch(fetchAdminCategoriesThunk())
        dispatch(fetchAdminBrandsThunk())
        dispatch(fetchAdminColorsThunk())
        dispatch(fetchAdminSizesThunk())
    }, [dispatch])

    // Đồng bộ variantsList khi variantModalProduct thay đổi (khi Redux update hoặc khi mở modal)
    useEffect(() => {
        if (variantModalProduct) {
            const currentProd = items.find(p => p.productId === variantModalProduct.productId)
            if (currentProd) {
                setVariantsList(currentProd.productVariants ? currentProd.productVariants.map((v) => ({
                    ...v,
                    _tempId: v.variantId || Math.random().toString(36).substr(2, 9),
                    _isEditing: false
                })) : [])
            }
        }
    }, [items, variantModalProduct])

    const filtered = items.filter((p) =>
        (p.productName || '').toLowerCase().includes(search.toLowerCase())
    )

    // --- Actions của Sản Phẩm ---
    const openAdd = () => { setForm(EMPTY); setModal('add') }

    const openEdit = (p) => {
        setForm({
            ...p,
            basePrice: String(p.basePrice || ''),
            salePrice: String(p.salePrice || ''),
            categoryId: String(p.categoryId || ''),
            brandId: String(p.brandId || ''),
            imageFile: null
        })
        setModal('edit')
    }

    const handleSaveProduct = async () => {
        const payload = new FormData()
        payload.append('ProductName', form.productName || '')
        payload.append('CategoryId', form.categoryId || '')
        payload.append('BrandId', form.brandId || '')
        payload.append('BasePrice', form.basePrice || 0)
        payload.append('SalePrice', form.salePrice || 0)
        payload.append('Description', form.description || '')
        payload.append('Slug', form.slug || '')
        payload.append('IsActive', form.isActive === undefined ? true : form.isActive)

        const selectedCategory = categories.find(c => String(c.categoryId) === String(form.categoryId));
        if (selectedCategory) payload.append('CategoryName', selectedCategory.categoryName);

        const selectedBrand = brands.find(b => String(b.brandId) === String(form.brandId));
        if (selectedBrand) payload.append('BrandName', selectedBrand.brandName);

        if (form.imageFile) {
            payload.append('file', form.imageFile) // Theo Swagger là 'file'
        } else if (form.imageUrl && !form.imageUrl.startsWith('blob:')) {
            payload.append('Image', form.imageUrl) // Theo Swagger là 'Image'
            if (form.imgPublicId) payload.append('ImagePublicId', form.imgPublicId)
        }

        try {
            if (modal === 'add') {
                await dispatch(createAdminProductThunk(payload)).unwrap()
                message.success('Thêm sản phẩm thành công!')
            } else {
                payload.append('ProductId', form.productId)
                await dispatch(updateAdminProductThunk({ productId: form.productId, data: payload })).unwrap()
                message.success('Cập nhật sản phẩm thành công!')
            }
            setModal(null)
            dispatch(fetchAdminProductsThunk({ page, pageSize }))
        } catch (error) {
            message.error(error || 'Có lỗi xảy ra khi lưu sản phẩm!')
        }
    }

    const handleDelete = async (productId) => {
        if (confirm('Xóa sản phẩm này và toàn bộ các biến thể của nó?')) {
            try {
                await dispatch(deleteAdminProductThunk(productId)).unwrap()
                message.success('Đã xóa sản phẩm!')
                dispatch(fetchAdminProductsThunk({ page, pageSize }))
            } catch (error) {
                message.error(error || 'Lỗi khi xóa sản phẩm!')
            }
        }
    }

    const f = (k) => (v) => setForm((prev) => ({ ...prev, [k]: v }))

    // --- Actions của Biến Thể ---
    const openVariantsModal = (p) => {
        setVariantModalProduct(p)
    }

    const handleAddVariantRow = () => {
        setVariantsList(prev => [...prev, { ...EMPTY_VARIANT, _isNew: true, _isEditing: true, _tempId: Math.random().toString(36).substr(2, 9) }])
    }

    const updateVariantTemp = (tempId, key, value) => {
        setVariantsList(prev => prev.map(v => v._tempId === tempId ? { ...v, [key]: value } : v))
    }

    const setEditRow = (tempId) => {
        setVariantsList(prev => prev.map(v => v._tempId === tempId ? { ...v, _isEditing: true, _original: { ...v } } : v))
    }

    const handleCancelRow = (tempId) => {
        setVariantsList(prev => {
            const row = prev.find(v => v._tempId === tempId)
            if (row?._isNew) return prev.filter(v => v._tempId !== tempId)
            return prev.map(v => v._tempId === tempId ? { ...v._original, _isEditing: false, _original: undefined } : v)
        })
    }

    const handleDeleteRow = async (tempId, variantId) => {
        if (!confirm('Bạn có chắc chắn muốn ẩn/xóa (ngưng hoạt động) biến thể này chứ?')) return;

        if (!variantId) {
            setVariantsList(p => p.filter(x => x._tempId !== tempId))
            return
        }

        const row = variantsList.find(v => v.variantId === variantId)
        if (!row) return;

        const color = colors.find(c => String(c.colorId || c.id) === String(row.colorId));
        const size = sizes.find(s => String(s.sizeId || s.id) === String(row.sizeId));

        const payload = {
            variantId: Number(variantId),
            productId: variantModalProduct.productId,
            colorId: Number(row.colorId),
            sizeId: Number(row.sizeId),
            sku: row.sku || '',
            stockQuantity: Number(row.stockQuantity || 0),
            priceOverride: row.priceOverride ? Number(row.priceOverride) : 0,
            isActive: false, // Soft-delete
            sizeLabel: size?.sizeLabel || size?.label || size?.name || row.sizeLabel || '',
            sizeSystem: size?.sizeSystem || row.sizeSystem || '',
            colorName: color?.colorName || color?.name || row.colorName || '',
            productName: variantModalProduct.productName || ''
        }

        try {
            await dispatch(updateAdminVariantThunk({ productId: variantModalProduct.productId, variantId, data: payload })).unwrap()
            setVariantsList(p => p.map(x => x.variantId === variantId ? { ...x, isActive: false } : x))
            message.success('Đã ngưng hoạt động biến thể!')
            dispatch(fetchAdminProductsThunk({ page, pageSize }))
        } catch (error) {
            message.error(error || 'Lỗi khi thao tác!')
        }
    }

    const handleConfirmRow = async (tempId) => {
        const row = variantsList.find(v => v._tempId === tempId)
        if (!row.colorId || !row.sizeId) {
            message.warning('Vui lòng chọn màu sắc và kích cỡ!')
            return;
        }

        const color = colors.find(c => String(c.colorId || c.id) === String(row.colorId));
        const size = sizes.find(s => String(s.sizeId || s.id) === String(row.sizeId));

        const payload = {
            variantId: row._isNew ? 0 : Number(row.variantId),
            productId: variantModalProduct.productId,
            colorId: Number(row.colorId),
            sizeId: Number(row.sizeId),
            sku: row.sku || '',
            stockQuantity: Number(row.stockQuantity || 0),
            priceOverride: row.priceOverride ? Number(row.priceOverride) : 0,
            isActive: row.isActive === undefined ? true : row.isActive,
            sizeLabel: size?.sizeLabel || size?.label || size?.name || row.sizeLabel || '',
            sizeSystem: size?.sizeSystem || row.sizeSystem || '',
            colorName: color?.colorName || color?.name || row.colorName || '',
            productName: variantModalProduct.productName || ''
        }

        try {
            if (row._isNew) {
                await dispatch(createAdminVariantThunk({ productId: variantModalProduct.productId, data: payload })).unwrap()
                message.success('Thêm biến thể thành công!')
            } else {
                await dispatch(updateAdminVariantThunk({ productId: variantModalProduct.productId, variantId: row.variantId, data: payload })).unwrap()
                message.success('Cập nhật biến thể thành công!')
            }
            setVariantsList(p => p.map(x => x._tempId === tempId ? { ...row, _isEditing: false, _isNew: false } : x))
            dispatch(fetchAdminProductsThunk({ page, pageSize }))
        } catch (error) {
            message.error(error || 'Lỗi khi lưu biến thể!')
        }
    }

    // --- Table Config ---
    const cols = [
        { key: 'productId', label: '#', render: (v) => <span style={{ color: '#94a3b8', fontWeight: '600' }}>#{v}</span> },
        {
            key: 'productName', label: 'Tên sản phẩm', render: (v, row) => (
                <span
                    onClick={() => openVariantsModal(row)}
                    style={{ fontWeight: '600', color: '#2563eb', cursor: 'pointer' }}
                    title="Click để quản lý biến thể"
                >
                    {v}
                </span>
            )
        },
        { key: 'categoryName', label: 'Danh mục' },
        { key: 'basePrice', label: 'Giá', render: (v) => <span style={{ fontWeight: '600', color: '#6366f1' }}>{fmt(v)}</span> },
        {
            key: 'stock', label: 'Tồn tổng', render: (_, row) => {
                const totalStock = row.productVariants?.reduce((sum, v) => sum + Number(v.stockQuantity || 0), 0) || 0
                return <span style={{ color: totalStock < 5 ? '#ef4444' : '#10b981', fontWeight: '600' }}>{totalStock}</span>
            }
        },
        { key: 'sold', label: 'Đã bán', render: (v) => <span style={{ fontWeight: '600', color: '#64748b' }}>{v || 0}</span> },
        {
            key: 'productVariants', label: 'Biến thể', render: (_, row) => (
                <span
                    onClick={() => openVariantsModal(row)}
                    style={{ color: '#4f46e5', fontWeight: '500', cursor: 'pointer', background: '#e0e7ff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}
                >
                    {row.productVariants?.length || 0} (Quản lý)
                </span>
            )
        },
        {
            key: 'isActive', label: 'Trạng thái',
            render: (v) => <span style={badge(v ? '#10b981' : '#94a3b8')}>{v ? 'Hoạt động' : 'Ẩn'}</span>
        },
        {
            key: '_actions', label: 'Thao tác',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <Btn small variant="secondary" onClick={() => openEdit(row)}>Sửa</Btn>
                    <Btn small variant="danger" onClick={() => handleDelete(row.productId)}>Xóa</Btn>
                </div>
            )
        },
    ]

    return (
        <div>
            <PageHeader
                title="Quản lý sản phẩm"
                subtitle={loading ? "Đang tải..." : `${items.length} sản phẩm`}
                action={<Btn onClick={openAdd}>+ Thêm sản phẩm</Btn>}
            />

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <SearchBar value={search} onChange={setSearch} placeholder="Tìm sản phẩm..." />
                    <span style={{ marginLeft: '12px', fontSize: '13px', color: '#64748b' }}>💡 Mẹo: Nhấn vào biểu tượng ▶ để xem nhanh các biến thể hoặc nút "Quản lý" để chỉnh sửa.</span>
                </div>
                <Table
                    columns={cols}
                    data={filtered}
                    keyField="productId"
                    expandableRowRender={(row) => (
                        <div style={{ padding: '10px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr 1fr 1.2fr', gap: '10px', padding: '8px', borderBottom: '1px solid #f1f5f9', fontWeight: '600', fontSize: '12px', color: '#64748b' }}>
                                <div>MÀU SẮC</div>
                                <div>SIZE</div>
                                <div>MÃ SKU</div>
                                <div>TỒN KHO</div>
                                <div>GIÁ RIÊNG</div>
                            </div>
                            {(row.productVariants || []).map(v => (
                                <div key={v.variantId} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr 1fr 1.2fr', gap: '10px', padding: '8px', fontSize: '13px', borderBottom: '1px solid #f8fafc' }}>
                                    <div style={{ color: '#334155', fontWeight: '500' }}>{v.colorName || '—'}</div>
                                    <div style={{ color: '#334155' }}>{v.sizeLabel || '—'}</div>
                                    <div style={{ color: '#64748b', fontFamily: 'monospace' }}>{v.sku || '—'}</div>
                                    <div style={{ color: v.stockQuantity < 5 ? '#ef4444' : '#10b981', fontWeight: '600' }}>{v.stockQuantity || 0}</div>
                                    <div style={{ color: '#64748b' }}>{v.priceOverride ? fmt(v.priceOverride) : 'Theo SP'}</div>
                                </div>
                            ))}
                            {(!row.productVariants || row.productVariants.length === 0) && (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Chưa có biến thể nào</div>
                            )}
                        </div>
                    )}
                />

                {/* Phân trang */}
                <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(p) => dispatch(setPage(p))}
                    />
                </div>
            </div>

            {/* MODAL 1: CHỈ CHỈNH SỬA THÔNG TIN SẢN PHẨM */}
            <Modal open={!!modal} title={modal === 'add' ? 'Thêm mới Sản phẩm' : 'Sửa thông tin Sản phẩm'} onClose={() => setModal(null)} width={600}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="Tên sản phẩm *"><Input value={form.productName} onChange={f('productName')} placeholder="Tên sản phẩm..." /></FormField>
                    <FormField label="Đường dẫn tĩnh (Slug)"><Input value={form.slug || ''} onChange={f('slug')} placeholder="duong-dan-url" /></FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="Danh mục">
                        <Select value={String(form.categoryId || '')} onChange={f('categoryId')} options={[{ value: '', label: '-- Chọn danh mục --' }, ...categories.map((c) => ({ value: String(c.categoryId), label: c.categoryName }))]} />
                    </FormField>
                    <FormField label="Thương hiệu">
                        <Select value={String(form.brandId || '')} onChange={f('brandId')} options={[{ value: '', label: '-- Chọn thương hiệu --' }, ...brands.map((b) => ({ value: String(b.brandId), label: b.brandName }))]} />
                    </FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="Giá niêm yết (VND)"><Input type="number" value={form.basePrice || ''} onChange={f('basePrice')} placeholder="0" /></FormField>
                    <FormField label="Giá khuyến mãi (VND)"><Input type="number" value={form.salePrice || ''} onChange={f('salePrice')} placeholder="0" /></FormField>
                </div>
                <FormField label="Hình ảnh Sản phẩm">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setForm(prev => ({
                                            ...prev,
                                            imageFile: e.target.files[0],
                                            imageUrl: URL.createObjectURL(e.target.files[0])
                                        }))
                                    }
                                }}
                                style={{ width: '100%', padding: '8px', border: '1px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', background: '#f8fafc' }}
                            />
                            {(form.imageUrl || form.imageFile) && (
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                                    {form.imageFile ? `Đã chọn file: ${form.imageFile.name}` : `Đang dùng ảnh hiện tại`}
                                </div>
                            )}
                        </div>
                        {(form.imageUrl || form.imageFile) && (
                            <img
                                src={form.imageUrl}
                                alt="Preview"
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                        )}
                    </div>
                </FormField>
                <FormField label="Mô tả"><Input value={form.description || ''} onChange={f('description')} placeholder="Mô tả sản phẩm..." /></FormField>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>Trạng thái hiển thị:</span>
                    <Toggle checked={form.isActive !== false} onChange={(v) => setForm(p => ({ ...p, isActive: v }))} />
                    <span style={{ fontSize: '13px', color: form.isActive !== false ? '#10b981' : '#94a3b8' }}>{form.isActive !== false ? 'Hoạt động' : 'Đã ẩn'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                    <Btn variant="secondary" onClick={() => setModal(null)}>Hủy bỏ</Btn>
                    <Btn onClick={handleSaveProduct}>{modal === 'add' ? "Tạo sản phẩm" : "Lưu thay đổi"}</Btn>
                </div>
            </Modal>

            {/* MODAL 2: QUẢN LÝ BIẾN THỂ CỦA SẢN PHẨM ĐƯỢC CHỌN (Granular Control) */}
            <Modal open={!!variantModalProduct} title={`Biến thể: ${variantModalProduct?.productName || ''}`} onClose={() => setVariantModalProduct(null)} width={850}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Thêm, sửa, xóa biến thể cho sản phẩm. (Mã: #{variantModalProduct?.productId})</p>
                    <Btn small onClick={handleAddVariantRow} style={{ background: '#e0e7ff', color: '#4f46e5' }}>+ Thêm biến thể mới</Btn>
                </div>

                {variantsList.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '30px 0', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        Sản phẩm này chưa có biến thể nào.<br /><span style={{ fontSize: '12px' }}>Bấm "+ Thêm biến thể mới" để tạo (Ví dụ: Size 38 - Đỏ).</span>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(70px, 1fr) minmax(70px, 1fr) minmax(110px, 1.5fr) minmax(60px, 1fr) minmax(90px, 1.2fr) minmax(60px, 1fr) 110px', gap: '10px', padding: '0 12px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                            <div>Màu sắc {variantsList.some(v => v._isEditing) && '*'}</div>
                            <div>Size {variantsList.some(v => v._isEditing) && '*'}</div>
                            <div>Mã SKU</div>
                            <div>Kho</div>
                            <div>Giá (Ngoại lệ)</div>
                            <div style={{ textAlign: 'center' }}>Trạng thái</div>
                            <div style={{ textAlign: 'center' }}>Thao tác</div>
                        </div>
                        {variantsList.map((v) => (
                            <div key={v._tempId} style={{ display: 'grid', gridTemplateColumns: 'minmax(70px, 1fr) minmax(70px, 1fr) minmax(110px, 1.5fr) minmax(60px, 1fr) minmax(90px, 1.2fr) minmax(60px, 1fr) 110px', gap: '10px', alignItems: 'center', padding: v._isEditing ? '12px' : '8px 12px', background: v._isEditing ? '#f8fafc' : '#fff', borderRadius: '8px', border: v._isEditing ? '1px solid #cbd5e1' : '1px solid #f1f5f9' }}>

                                {v._isEditing ? (
                                    <Select value={String(v.colorId || '')} onChange={(val) => updateVariantTemp(v._tempId, 'colorId', val)} options={[{ value: '', label: 'Chọn' }, ...colors.map(c => ({ value: String(c.colorId || c.id), label: c.colorName || c.name }))]} />
                                ) : (
                                    <span style={{ fontSize: '13px', color: '#334155' }}>{v.colorName || '—'}</span>
                                )}

                                {v._isEditing ? (
                                    <Select value={String(v.sizeId || '')} onChange={(val) => updateVariantTemp(v._tempId, 'sizeId', val)} options={[{ value: '', label: 'Chọn' }, ...sizes.map(s => ({ value: String(s.sizeId || s.id), label: s.sizeLabel || s.label || s.sizeName || s.name }))]} />
                                ) : (
                                    <span style={{ fontSize: '13px', color: '#334155' }}>{v.sizeLabel || '—'}</span>
                                )}

                                {v._isEditing ? (
                                    <Input value={v.sku || ''} onChange={(val) => updateVariantTemp(v._tempId, 'sku', val)} placeholder="VD: NIK-BK-38" />
                                ) : (
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>{v.sku || '—'}</span>
                                )}

                                {v._isEditing ? (
                                    <Input type="number" value={v.stockQuantity} onChange={(val) => updateVariantTemp(v._tempId, 'stockQuantity', val)} placeholder="0" />
                                ) : (
                                    <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '500' }}>{v.stockQuantity || 0}</span>
                                )}

                                {v._isEditing ? (
                                    <Input type="number" value={v.priceOverride} onChange={(val) => updateVariantTemp(v._tempId, 'priceOverride', val)} placeholder="VNĐ" />
                                ) : (
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>{v.priceOverride ? fmt(v.priceOverride) : 'Mặc định'}</span>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {v._isEditing ? (
                                        <Toggle checked={v.isActive !== false} onChange={(val) => updateVariantTemp(v._tempId, 'isActive', val)} />
                                    ) : (
                                        <span style={{ fontSize: '13px', color: v.isActive !== false ? '#10b981' : '#94a3b8' }}>{v.isActive !== false ? 'Hiện' : 'Ẩn'}</span>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                    {v._isEditing ? (
                                        <>
                                            <Btn small variant="success" onClick={() => handleConfirmRow(v._tempId)}>Xác nhận</Btn>
                                            <Btn small variant="danger" onClick={() => handleCancelRow(v._tempId)}>Hủy</Btn>
                                        </>
                                    ) : (
                                        <>
                                            <Btn small variant="secondary" onClick={() => setEditRow(v._tempId)}>Sửa</Btn>
                                            <Btn small variant="danger" onClick={() => handleDeleteRow(v._tempId, v.variantId)}>Xóa</Btn>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <Btn variant="secondary" onClick={() => setVariantModalProduct(null)}>Đóng cửa sổ</Btn>
                </div>
            </Modal>
        </div>
    )
}
