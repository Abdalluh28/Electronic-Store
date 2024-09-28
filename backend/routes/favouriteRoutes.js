const express = require("express");
const router = express.Router();


const favouriteController = require("../controllers/favouriteController");


router.route('/').delete(favouriteController.clearFavourite);

module.exports = router