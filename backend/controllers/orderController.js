const mongoose = require("mongoose");
const asyncHandler = require("../middleware/asyncHandler.js");
const Order = require("../models/orderModel");
const Product = require("../models/productModel.js");
const User = require("../models/userModel.js");


const calcPrice = async (orderItems, shippingPrice) => {
    const prices = await Promise.all(orderItems.map(async item => {
        const product = await Product.findById(item.product)
        return product.price * item.qty
    }))

    const itemsPrice = prices.reduce((acc, price) => acc + price, 0)

    const taxRate = 0.02
    const taxPrice = (itemsPrice * taxRate).toFixed(2);
    const totalPrice = (itemsPrice + shippingPrice + parseFloat(taxPrice)).toFixed(2);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        taxPrice,
        totalPrice
    }

}

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, user, shippingPrice, orderNotes } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        const itemsFromDb = await Product.find({
            _id: { $in: orderItems.map(item => item.product) }
        });

        const dbOrderItems = await Promise.all(orderItems.map(async item => {
            const matchingItemFromDB = itemsFromDb.find(dbItem => dbItem._id.toString() === item.product.toString());

            if (!matchingItemFromDB) {
                return res.status(404).json({ message: "Product not found", id: item.product });
            }

            // Update sold quantity and save it to the database
            matchingItemFromDB.sold += item.qty;
            await matchingItemFromDB.save();  

            return {
                qty: item.qty,
                name: matchingItemFromDB.name,
                image: matchingItemFromDB.images[0],
                price: matchingItemFromDB.price,
                product: matchingItemFromDB._id
            };
        }));

        let isPaid = paymentMethod === 'card';

        const { itemsPrice, taxPrice, totalPrice } = await calcPrice(dbOrderItems, shippingPrice);

        const order = new Order({
            orderItems: dbOrderItems,
            shippingAddress,
            paymentMethod,
            user,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            orderNotes: orderNotes || '',
            isPaid
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


const getAllOrders = asyncHandler(async (req, res) => {
    try {

        const pageSize = 5;
        const page = parseInt(req.query.page) || 1;

        const orders = await Order.find().limit(pageSize).skip(pageSize * (page - 1));
        const allOrders = await Order.countDocuments();
        const pages = Math.ceil(allOrders / pageSize);

        res.status(200).json({ orders, page, pages });

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})


const getMyOrders = asyncHandler(async (req, res) => {

    try {
        const { id } = req.params;
        console.log(id)
        const orders = await Order.find({});

        const myOrders = orders.filter(order => order.user.toString() === id);

        if (!myOrders) {
            console.log(orders)
            return res.status(404).json({ message: "Orders not found" })
        }

        res.status(200).json(myOrders);



    } catch (error) {
        return res.status(500).json({ message: error.message })
    }


})



const getSingleOrder = asyncHandler(async (req, res) => {


    try {

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        const userInfo = await User.findById(order.user);


        res.status(200).json({ order, userName: userInfo.firstName });

    } catch {
        return res.status(500).json({ message: error.message })
    }

})



const updateOrderToPaid = asyncHandler(async (req, res) => {

    try {

        const { id, status, updateTime, email } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }


        order.isPaid = true;
        order.paymentResult = {
            id,
            status,
            updateTime,
            email
        }


        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);


    } catch {
        return res.status(500).json({ message: error.message })
    }

})



const updateOrderToDelivered = asyncHandler(async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }


        order.isDelivered = true;
        order.isPaid = true;

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})


const getTotalOrders = asyncHandler(async (req, res) => {


    try {


        const orders = await Order.countDocuments({});

        res.status(200).json(orders);


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

})



const getTotalSales = asyncHandler(async (req, res) => {


    try {

        const orders = await Order.find({});

        const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        res.status(200).json(totalSales);


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

})



const getTotalSalesByDate = asyncHandler(async (req, res) => {


    try {

        const orders = await Order.aggregate([
            {
                $match: {
                    isPaid: true
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
                    },
                    totalSales: { $sum: "$totalPrice" }
                }
            }
        ])


        res.status(200).json(orders);


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

module.exports = {
    createOrder, getAllOrders, getMyOrders, getSingleOrder, updateOrderToPaid,
    updateOrderToDelivered, getTotalOrders, getTotalSales, getTotalSalesByDate
}