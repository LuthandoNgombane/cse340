const express = require("express")
const router = new express.Router()
const revCont = require("../controllers/reviewController")
const regUtil = require("../utilities") // Assuming this has your checkLogin middleware
const validate = require("../utilities/review-validation") // We will build this next

// Route to add a new review
// Only logged-in users should be able to post
router.post(
  "/add",
  regUtil.checkLogin,
  validate.reviewRules(),
  validate.checkReviewData,
  revCont.addReview
)

// Add routes for Edit and Delete as needed for your final project
router.get("/edit/:review_id", revCont.editReviewView)
router.post("/update", revCont.updateReview)
router.post("/delete", revCont.deleteReview)

module.exports = router