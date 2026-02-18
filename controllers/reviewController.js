const revModel = require("../models/review-model")
const utilities = require("../utilities/")

const revCont = {}

/* ***************************
 * Add Review
 * ************************** */
revCont.addReview = async function (req, res) {
  const { review_text, inv_id, account_id } = req.body
  
  try {
    const addResult = await revModel.addReview(review_text, inv_id, account_id)

    if (addResult) {
      req.flash("notice", "Success! Your review has been added.")
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Sorry, the review could not be added.")
      res.redirect(`/inv/detail/${inv_id}`)
    }
  } catch (error) {
    // "Error Handling
    req.flash("notice", "A server error occurred while posting your review.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ***************************
 * Update Review Data
 * ************************** */
revCont.updateReview = async function (req, res) {
  const { review_id, review_text } = req.body
  const updateResult = await revModel.updateReview(review_id, review_text)
  if (updateResult) {
    req.flash("notice", "The review was successfully updated.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.redirect(`/review/edit/${review_id}`)
  }
}

/* ***************************
 * Deliver Edit Review View
 * ************************** */
revCont.editReviewView = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await revModel.getReviewById(review_id) 
  
  // Check if reviewData exists
  if (!reviewData) {
    req.flash("notice", "Review not found.")
    return res.redirect("/account/")
  }

  res.render("review/edit-review", {
    title: "Edit Review",
    nav,
    review: reviewData, 
    errors: null,
  })
}

/* ***************************
 * Deliver Delete Confirmation View
 * ************************** */
revCont.deleteReviewView = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await revModel.getReviewById(review_id)

  if (!reviewData) {
    req.flash("notice", "Review not found.")
    return res.redirect("/account/")
  }

  res.render("review/delete-review", {
    title: "Delete Review",
    nav,
    review: reviewData,
    errors: null,
  })
}

/* ***************************
 * Process Delete Review
 * ************************** */
revCont.deleteReview = async function (req, res) {
  const review_id = parseInt(req.body.review_id)
  const deleteResult = await revModel.deleteReview(review_id)

  if (deleteResult) {
    req.flash("notice", "The review was successfully deleted.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/review/delete-confirm/${review_id}`)
  }
}


module.exports = revCont