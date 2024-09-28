const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController')

const {authorizeAdmin} = require('../middleware/authMiddleware')

router.route('/register').post(authController.register)
router.route('/sendVerificationEmail').post(authController.sendVerificationEmailLogin)
router.route('/verifyEmail').post(authController.verifyEmail)
router.route('/login').post(authController.login)
router.route('/refresh').get(authController.refresh)
router.route('/logout').post(authController.logout)



module.exports = router
