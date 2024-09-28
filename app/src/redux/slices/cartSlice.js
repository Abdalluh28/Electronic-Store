import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
    total: 0,
    quantity: 0
}

const cartSlice = createSlice({
    initialState,
    name: 'cart',

    reducers: {
        addItemToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === newItem.id);
            state.quantity += newItem.quantity;
            state.total += newItem.price * newItem.quantity;

            if (!existingItem) {
                state.cartItems.push({
                    id: newItem.id,
                    name: newItem.name,
                    image: newItem.image,
                    price: newItem.price,
                    quantity: newItem.quantity,
                    totalPrice: newItem.price * newItem.quantity
                })
            } else {
                existingItem.quantity += newItem.quantity;
                existingItem.totalPrice += newItem.price * newItem.quantity;
            }
            
        },

        plusItemToCart: (state, action) => {
            const { id } = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === id);
            state.quantity++;
            state.total += existingItem.price;
            existingItem.quantity++;
            existingItem.totalPrice += existingItem.price;
        },

        minusItemFromCart: (state, action) => {
            const { id } = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === id);
            if(existingItem.quantity > 1) {
                state.quantity--;
                state.total -= existingItem.price;
                existingItem.quantity--;
                existingItem.totalPrice -= existingItem.price;
            }
        },

        removeItemFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === id);
            state.total -= existingItem.price * existingItem.quantity;
            state.quantity -= existingItem.quantity;

            state.cartItems = state.cartItems.filter((item) => item.id !== id);
        },

        clearCart: (state) => {
            state.cartItems = [];
            state.total = 0;
            state.quantity = 0
        },

        editTotalPrice: (state, action) => {
            const { price } = action.payload;
            state.total = price
        },


        updateCartAfterLogin: (state, action) => {
            const { cartItems, totalPrice, totalQuantity } = action.payload;

            state.cartItems = cartItems
            state.total = totalPrice
            state.quantity = totalQuantity
        }
    }

})


export const { addItemToCart, plusItemToCart, minusItemFromCart, removeItemFromCart, clearCart, editTotalPrice, updateCartAfterLogin } = cartSlice.actions;

export default cartSlice.reducer