const User = require("../models/userModel.js");
const asyncHandler = require("../middleware/asyncHandler.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Product = require("../models/productModel");

const createTokens = require('../utils/createTokens.js')

const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ firstName, lastName, email, password: hashedPassword });


    const { accessToken, refreshToken } = await createTokens(newUser, res);

    try {
        await sendVerificationEmailRegister(newUser, accessToken);
        return res.json({
            accessToken,
            refreshToken,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            isVerified: newUser.isVerified,
            id: newUser._id
        })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

})

const sendVerificationEmailRegister = async (newUser, accessToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abdok7496@gmail.com',
            pass: 'nmyk kfxb idjj ryqk' // Consider using environment variables for security
        }
    });

    const mailOptions = {
        from: 'abdok7496@gmail.com',
        to: newUser.email,
        subject: 'Verify your email',
        text: `Please verify your email by clicking the following link: http://localhost:3001/auth/verify/${newUser._id}/${accessToken}`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info.response);
            }
        });
    });
};


const sendVerificationEmailLogin = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.status(401).json({ message: "User does not exist" });
    }

    const { accessToken, refreshToken } = await createTokens(existingUser, res);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abdok7496@gmail.com',
            pass: 'nmyk kfxb idjj ryqk' // Consider using environment variables for security
        }
    });

    const mailOptions = {
        from: 'abdok7496@gmail.com',
        to: existingUser.email,
        subject: 'Verify your email',
        text: `Please verify your email by clicking the following link: http://localhost:3001/auth/verify/${existingUser._id}/${accessToken}`
    };

    try {
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info.response);
                }
            });
        });

        // Return user information and tokens in response like in register
        return res.json({
            accessToken,
            refreshToken,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            isAdmin: existingUser.isAdmin,
            isVerified: existingUser.isVerified,
            id: existingUser._id
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { id, accessToken } = req.body;

    const existingUser = await User.findById(id);

    if (!existingUser) {
        return res.status(400).json({ message: "User does not exist" });
    }

    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' })
            } else {
                existingUser.isVerified = true;
                await existingUser.save();
                return res.status(200).json({
                    message: 'Email verified successfully',
                    accessToken,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email,
                    isAdmin: existingUser.isAdmin,
                    isVerified: existingUser.isVerified,
                    id: existingUser._id
                })
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})
const login = asyncHandler(async (req, res) => {
    const { email, password, cart, favourite } = req.body; // cart is sent from frontend session

    console.log(favourite)

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser || existingUser.isAdmin) {
        return res.status(400).json({ message: "User does not exist" });
    }

    if (!existingUser.isVerified) {
        return res.status(401).json({ message: "Please verify your email" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
        return res.status(402).json({ message: "Incorrect password" });
    }

    // Merge the cart (if the guest cart exists) not working yet (if there is cart in the db )
    let items = [];
    if (cart && cart.items.length > 0) {
        const userCart = existingUser.cart || { items: [], totalPrice: 0, totalQuantity: 0 };



        cart.items.forEach((guestItem) => {

            const existingItem = userCart.items.find((userItem) => userItem.product.toString() === guestItem.id.toString());
            if (existingItem) {
                // If the item already exists in the cart, update the quantity
                existingItem.quantity += guestItem.quantity;
            } else {
                // If the item does not exist in the cart, add it
                userCart.items.push({ product: guestItem.id, quantity: guestItem.quantity, price: guestItem.price });
            }

        });

        // Recalculate the total price and quantity
        userCart.totalPrice = userCart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        userCart.totalQuantity = userCart.items.reduce((total, item) => total + item.quantity, 0);

        // Save the updated cart to the user
        try {
            existingUser.cart = userCart;
            await existingUser.save();
            console.log(existingUser.cart)
            items = await Promise.all(
                existingUser.cart.items.map(async (item) => {
                    const product = await Product.findById(item.product);
                    const quantity = userCart.items.find((i) => i.product.toString() === item.product.toString()).quantity;
                    return {
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        quantity,
                        image: product.images[0],
                        totalPrice: product.price * quantity
                    }
                })
            );



        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }


    if (cart && cart.items.length === 0) {
        items = await Promise.all(
            existingUser.cart.items.map(async (item) => {
                const product = await Product.findById(item.product);
                const quantity = existingUser.cart.items.find((i) => i.product.toString() === item.product.toString()).quantity;
                return {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image: product.images[0],
                    totalPrice: product.price * quantity
                }
            })
        );
    }

    let favouriteItems = [];
    if (favourite && favourite.length > 0) {
        // merge the favourite items with the existing user's favourite items
        const existingFavouriteItems = existingUser.favouriteItems || [];

        favourite.map((item) => {
            const existingItem = existingFavouriteItems.find((favouriteItem) => favouriteItem.product.toString() === item.id.toString());
            if (!existingItem) {
                existingFavouriteItems.push({ product: item.id });
            }
        })

        try {

            existingUser.favouriteItems = existingFavouriteItems;

            await existingUser.save();

            favouriteItems = await Promise.all(
                existingUser.favouriteItems.map(async (item) => {
                    const product = await Product.findById(item.product);
                    return {
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                    }
                })
            );


        } catch (error) {

            return res.status(500).json({ message: error.message });
        }

    }

    if (favourite && favourite.length === 0) {
        favouriteItems = await Promise.all(
            existingUser.favouriteItems.map(async (item) => {
                const product = await Product.findById(item.product);
                return {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                }
            })
        );

    }

    const { accessToken, refreshToken } = await createTokens(existingUser, res);
    console.log(favouriteItems.length)
    try {
        const userInfo = {
            accessToken,
            refreshToken,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            isAdmin: existingUser.isAdmin,
            isVerified: existingUser.isVerified,
            id: existingUser._id,
            items,
            totalPrice: existingUser.cart.totalPrice,
            totalQuantity: existingUser.cart.totalQuantity,
            favouriteItems,
            favouriteTotalQuantity: favouriteItems.length
        };
        res.cookie('userInfo', JSON.stringify(userInfo), { httpOnly: true, sameSite: 'None', secure: process.env.NODE_ENV === 'production' });
        return res.json(userInfo);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;
    const userInfo = cookies.userInfo;
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            // Refresh token is invalid or expired
            return res.status(403).json({ message: "Forbidden" });
        }


        const existingUser = await User.findById(decoded.userInfo.id);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const accessToken = jwt.sign({
            userInfo: {
                id: existingUser._id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

        return res.json({ accessToken, userInfo })
    })
})


const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    const { cart, id, favourite } = req.body;
    

    const existingUser = await User.findById(id);

    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }


    // Merge the cart (if the guest cart exists) 
    if (cart && cart.items.length > 0) {

        const userCart = existingUser.cart || { items: [], totalPrice: 0, totalQuantity: 0 };

        const guestItemIds = cart.items.map((item) => item.id.toString());

        userCart.items = userCart.items.filter((userItem) => guestItemIds.includes(userItem.product.toString()));

        cart.items.forEach((guestItem) => {

            const existingItem = userCart.items.find((userItem) => userItem.product.toString() === guestItem.id.toString());

            if (existingItem) {
                // If the item already exists in the cart, update the quantity
                existingItem.quantity = guestItem.quantity;
            } else {
                // If the item does not exist in the cart, add it
                userCart.items.push({ product: guestItem.id, quantity: guestItem.quantity, price: guestItem.price });
            }

        });

        // Recalculate the total price and quantity
        userCart.totalPrice = userCart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        userCart.totalQuantity = userCart.items.reduce((total, item) => total + item.quantity, 0);

        // Save the updated cart to the user
        try {
            existingUser.cart = userCart;
            await existingUser.save();

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    console.log(favourite)
    if (favourite && favourite.length > 0) {
        // merge the favourite items with the existing user's favourite items
        let existingFavouriteItems = existingUser.favouriteItems || [];

        const guestItemIds = favourite.map((item) => item.id.toString());

        existingFavouriteItems = existingFavouriteItems.filter((userItem) => guestItemIds.includes(userItem.product.toString()));

        favourite.map((item) => {
            const existingItem = existingFavouriteItems.find((favouriteItem) => favouriteItem.product.toString() === item.id.toString());
            if (!existingItem) {
                existingFavouriteItems.push({ product: item.id });
            }
        })
        console.log(existingFavouriteItems)

        try {
            existingUser.favouriteItems = existingFavouriteItems;
            await existingUser.save();

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }

    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.NODE_ENV === 'production',
    })

    return res.json({ 'message': 'Cookie cleared' })

})

module.exports = {
    register,
    sendVerificationEmailLogin,
    verifyEmail,
    login,
    refresh,
    logout
}
