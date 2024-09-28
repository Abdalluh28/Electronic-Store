
const User = require('../models/userModel');
const asyncHandler = require('../middleware/asyncHandler')
const bcrypt = require('bcryptjs');

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();

    return res.status(200).json(users)
})


const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        return res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        })
    } else {
        return res.status(404).message({ message: 'User not found' })
    }
})


const updateUserProfile = asyncHandler(async (req, res) => {
    const userInfo = JSON.parse(req.cookies.userInfo);
    const user = await User.findById(userInfo.id);
    console.log('userInfo: ', user)
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    if (req.body.email) {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
            return res.status(401).json({
                message: 'Email already in use', 
                id: existingUser._id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
                isVerified: existingUser.isVerified
            });
        }
        user.email = req.body.email
        user.isVerified = false
    }

    if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        user.password = hashedPassword
    }


    const updatedUser = await user.save();

    return res.json({
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isVerified: updatedUser.isVerified
    })

})


const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.body.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    if (user.isAdmin) {
        return res.status(401).json({ message: 'You cannot delete an admin' })
    }

    await User.deleteOne({ _id: user._id })

    return res.status(200).json({ message: 'User deleted' })

})


const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.body.id).select('-password').lean();

    if (!user) {
        return res.status(404).message({ message: 'User not found' })
    }

    return res.json(user)
})

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.body.id);
    if (!user) {
        return res.status(404).message({ message: 'User not found' })
    }

    console.log(req.body)

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    if (req.body.email) {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
            return res.status(401).json({
                message: 'Email already in use',
                id: existingUser._id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
                isVerified: existingUser.isVerified
            });
        }
        user.email = req.body.email
        user.isVerified = false
    }


    const updatedUser = await user.save();
    return res.json({
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isVerified: updatedUser.isVerified
    })
})

module.exports = { getAllUsers, getUserProfile, updateUserProfile, deleteUser, getUser, updateUser }