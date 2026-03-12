import { configureStore } from '@reduxjs/toolkit'
import itemReducer from './CreateSlice'
export const store = configureStore({
  reducer: {
    app:itemReducer
  },
})