const mongoose = require("mongoose");


const cartItemSchema  = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    price: {
        type: Number,
        required: true,
        min: 0
    }
})


const favouriteItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
})


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    }, 
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    cart: {
        items: [cartItemSchema],
        totalPrice: {
            type: Number,
            default: 0,
            min: 0
        },
        totalQuantity: {
            type: Number,
            default: 0,
            min: 0
        },
    },

    favouriteItems: [favouriteItemSchema],

    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },

    isVerified: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});


const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User