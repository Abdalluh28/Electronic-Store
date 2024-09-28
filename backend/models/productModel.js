const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

const reviewSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
    },
    user: {
        type: objectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });


const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    brand: {
        type: String,
        required: true
    },
    category: {
        type: objectId,
        required: true,
        ref: "Category"
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    countInStock: {
        type: Number,
        default: 0
    },

    sold: {
        type: Number,
        default: 0
    },

}, { timestamps: true });


const Product = mongoose.model("Product", productSchema);
module.exports = Product