import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import cartReducer  from "./slices/cartSlice";
import favouriteReducer  from "./slices/favouriteSlice";
import filterReducer  from "./slices/filterSlice";
import ordersReducer  from "./slices/ordersSlice";

import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage";


const cartPersistConfig = {
    key: 'cart',
    storage,
    whitelist: ['cartItems', 'total', 'quantity']
}

const favouritePersistConfig = {
    key: 'favourite',
    storage,
    whitelist: ['favouriteItems', 'quantity']
}


const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedFavouriteReducer = persistReducer(favouritePersistConfig, favouriteReducer);


export const Store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: persistedCartReducer,
        favourite: persistedFavouriteReducer,
        filter: filterReducer,
        orders: ordersReducer
    },


    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({serializableCheck: false}).concat(apiSlice.middleware);
    },

    devTools: process.env.REACT_APP_NODE_ENV !== 'production',
})


export const persistor = persistStore(Store);

setupListeners(Store.dispatch);