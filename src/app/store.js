import { configureStore } from '@reduxjs/toolkit'
import calendarReducer from '../features/calendarPage/calendarPageSlice'

export default configureStore({
  reducer: {
    calendar: calendarReducer
  }
})