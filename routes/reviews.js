const express = require('express');
const router = express.Router({ mergeParams: true });  //mergeparams is set to true as a result we have acess to camp id param else we wont
const { validateReview, isloggedin, isreviewauthor } = require('../middleware');
const { createreview, deletereview } = require('../controllers/reviews');

router.post('/', isloggedin, validateReview, createreview)

router.delete('/:reviewid', isloggedin, isreviewauthor, deletereview)

module.exports = router;