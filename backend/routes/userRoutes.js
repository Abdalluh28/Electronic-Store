const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const { verifyAdmin, verifyJWT } = require('../middleware/authMiddleware')


router.route('/').get(verifyJWT,verifyAdmin,userController.getAllUsers);

router.route('/profile').get(verifyJWT, userController.getUserProfile).put(verifyJWT, userController.updateUserProfile)

router.route('/:id').delete(verifyJWT,verifyAdmin,userController.deleteUser).get(verifyJWT,verifyAdmin,userController.getUser).put(verifyJWT,verifyAdmin,userController.updateUser)

module.exports = router
