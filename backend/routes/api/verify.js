const express = require("express");
const router = express.Router();
const verifyController = require("../../controllers/verifyController");

router.route("/:email/:token").get(verifyController.verifyUser);

module.exports = router;
