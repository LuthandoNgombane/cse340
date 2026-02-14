const db = require("../database/")

/* *****************************
* Add a new review
* ***************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = "INSERT INTO public.review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    return await db.query(sql, [review_text, inv_id, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Get reviews for a specific vehicle
* Includes a JOIN to get the reviewer's name
* ***************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM public.review AS r 
                 JOIN public.account AS a ON r.account_id = a.account_id 
                 WHERE r.inv_id = $1 
                 ORDER BY r.review_date DESC`
    const data = await db.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Get reviews written by a specific account
* ***************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `SELECT r.*, i.inv_make, i.inv_model 
                 FROM public.review AS r 
                 JOIN public.inventory AS i ON r.inv_id = i.inv_id 
                 WHERE r.account_id = $1 
                 ORDER BY r.review_date DESC`
    const data = await db.query(sql, [account_id])
    return data.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Update a review
* ***************************** */
async function updateReview(review_id, review_text) {
  try {
    const sql = "UPDATE public.review SET review_text = $1, review_date = NOW() WHERE review_id = $2 RETURNING *"
    return await db.query(sql, [review_text, review_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Delete a review
* ***************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM public.review WHERE review_id = $1"
    return await db.query(sql, [review_id])
  } catch (error) {
    return new Error("Delete Review Failed")
  }
}

module.exports = {
  addReview,
  getReviewsByInvId,
  getReviewsByAccountId,
  updateReview,
  deleteReview
}