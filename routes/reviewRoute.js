const express = require("express")
const router = new express.Router()
const revCont = require("../controllers/reviewController")
const regUtil = require("../utilities") 
const validate = require("../utilities/review-validation")

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
router.get("/delete-confirm/:review_id", regUtil.handleErrors(revCont.deleteReviewView))
router.post("/delete-review", regUtil.handleErrors(revCont.deleteReview))
module.exports = router