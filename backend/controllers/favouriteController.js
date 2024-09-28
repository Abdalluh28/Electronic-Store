const User = require('../models/userModel');


const clearFavourite = async (req, res) => {

    const { id } = req.body;
    console.log(id)

    const existingUser = await User.findById(id);

    if (!existingUser) {
        return res.status(400).json({ message: "User does not exist" });
    }

    try {
        
        existingUser.favouriteItems = [];
        await existingUser.save();
        return res.status(200).json({ message: 'Favourite cleared successfully' });


    } catch (error) {
        
        return res.status(500).json({ message: error.message });

    }


}


module.exports = { clearFavourite }