const User = require('../models/userModel');


const clearCart = async (req, res) => {

    const { id } = req.body;
    console.log(id)

    const existingUser = await User.findById(id);

    if (!existingUser) {
        return res.status(400).json({ message: "User does not exist" });
    }

    try {
        
        existingUser.cart.items = [];
        existingUser.cart.totalPrice = 0;
        existingUser.cart.totalQuantity = 0;
        console.log(existingUser)
        await existingUser.save();
        return res.status(200).json({ message: 'Cart cleared successfully' });


    } catch (error) {
        
        return res.status(500).json({ message: error.message });

    }


}


module.exports = { clearCart }