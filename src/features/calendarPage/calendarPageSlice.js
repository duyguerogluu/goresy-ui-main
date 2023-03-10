import { createSlice } from '@reduxjs/toolkit'

export const calendarPageSlice = createSlice({
  name: 'calendarPageSlice',
  initialState: {
    customer: ''
  },
  reducers: {
    setCustomer: (state, action) => {
        state.customer = action.payload
    }
  }
})

export const { setCustomer } = calendarPageSlice.actions

export default calendarPageSlice.reducer