const express = require("express");
const router = express.Router();
const resumeController = require("../../controllers/resumeController");
const verifyJWT = require("../../middleware/verifyJWT");
const isUserVerified = require("../../middleware/isUserVerified");

router
  .route("/")
  .post(verifyJWT, isUserVerified, resumeController.handleSaveNewResume)
  .put(verifyJWT, isUserVerified, resumeController.handleModifyResume);

router
  .route("/all-titles")
  .get(verifyJWT, resumeController.handleFetchAllResumeTitles);

router.route("/:title").get(verifyJWT, resumeController.handleFetchSavedResume);

module.exports = router;
