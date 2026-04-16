// import { createSlice } from '@reduxjs/toolkit'
// import {
//     fetchAdminRefundsThunk,
//     updateAdminRefundStatusThunk,
// } from '../../actions/admin/adminRefundAction'

// const adminRefundSlice = createSlice({
//     name: 'adminRefund',
//     initialState: { items: [], total: 0, loading: false, error: null },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchAdminRefundsThunk.pending, (s) => { s.loading = true; s.error = null })
//             .addCase(fetchAdminRefundsThunk.fulfilled, (s, a) => {
//                 s.loading = false
//                 s.items = a.payload.data ?? a.payload
//                 s.total = a.payload.total ?? s.items.length
//             })
//             .addCase(fetchAdminRefundsThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
//             .addCase(updateAdminRefundStatusThunk.fulfilled, (s, a) => {
//                 const idx = s.items.findIndex((x) => x.id === a.payload.id)
//                 if (idx !== -1) s.items[idx].status = a.payload.status
//             })
//     },
// })

// export default adminRefundSlice.reducer
