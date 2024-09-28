import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    flag: false,
}


const ordersSlice = createSlice({
    initialState,
    name: 'orders',
    reducers: {
        setFlag: (state, action) => {
            state.flag = action.payload
        },
    }
})


export const { setFlag } = ordersSlice.actions
export default ordersSlice.reducer