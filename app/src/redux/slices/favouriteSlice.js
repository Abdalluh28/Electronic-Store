import { createSlice } from '@reduxjs/toolkit';


const favouriteSlice = createSlice({
    initialState: {
        favouriteItems: [],
        quantity: 0,
    },
    name: 'favourite',

    reducers: {
        addItemToFavourite: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.favouriteItems.find((item) => item.id === newItem.id);

            if(!existingItem) {
                state.favouriteItems = [...state.favouriteItems,
                    {
                        id: newItem.id,
                        name: newItem.name,
                        image: newItem.image,
                        price: newItem.price,
                        quantity: 1,
                        totalPrice: newItem.price,
                    },
                    ];
                state.quantity++;
            } 

            console.log(state.favouriteItems)

        },

        removeItemFromFavourite: (state, action) => {
            const id = action.payload;
            const existingItem = state.favouriteItems.find((item) => item.id === id);
            
            if(existingItem) {
                state.favouriteItems = state.favouriteItems.filter((item) => item.id !== id);
                state.quantity -= 1;
            } 
        },

        clearFavourite: (state) => {
            state.favouriteItems = [];
            state.quantity = 0
        },


        updateFavouriteAfterLogin: (state, action) => {
            const { favouriteItems, favouriteTotalQuantity } = action.payload;

            state.favouriteItems = favouriteItems
            state.quantity = favouriteTotalQuantity
        }
    }

})


export const { addItemToFavourite, removeItemFromFavourite, clearFavourite, updateFavouriteAfterLogin } = favouriteSlice.actions;

export default favouriteSlice.reducer