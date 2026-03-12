import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const counterSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
   addtocard:(state, action)=>{
    let existingItem = state.find((item) => item.id === action.payload.id)
    if (existingItem) {
      // increase quantity if item already exists
      return state.map((item) => item.id === action.payload.id ? { ...item, quantity: (item.quantity || 0) + 1 } : item)
    } else {
      // add new item with quantity 1
      state.push({ ...action.payload, quantity: 1 });
    }
   },
   increaseQuantity(state, action) {
     return state.map((item) =>
         item.id === action.payload
             ? { ...item, quantity: (item.quantity || 1) + 1 } // default to 1 if undefined
             : item
     );
   },
   decreaseQuantity(state, action) {
     return state.map((item) =>
         item.id === action.payload
             ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) } // never go below 1
             : item
     );
   },
   removeitem(state,action){
   return state.filter((item)=>item.id!==action.payload)
   }
  }
})

// Action creators are generated for each case reducer function
export const {addtocard,increaseQuantity,decreaseQuantity,removeitem } = counterSlice.actions

export default counterSlice.reducer