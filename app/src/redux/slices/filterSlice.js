import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    category: [],
    minPrice: 0,
    maxPrice: 5000,
    rating: 0,
    sortBy: null,
}


const filterSlice = createSlice({
    initialState,
    name: 'filter',
    reducers: {
        setCategory: (state, action) => {
            state.category = action.payload
        },
        setMinPrice: (state, action) => {
            state.minPrice = action.payload
        },
        setMaxPrice: (state, action) => {
            state.maxPrice = action.payload
        },
        setRating: (state, action) => {
            state.rating = action.payload
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload
        },

        clearFilter: (state) => {
            state.category = []
            state.minPrice = 0
            state.maxPrice = 5000
            state.rating = 0
            state.sortBy = null
        }
    }
})

export const { setCategory, setMinPrice, setMaxPrice, setRating, setSortBy, clearFilter } = filterSlice.actions
export default filterSlice.reducer