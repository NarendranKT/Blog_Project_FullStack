const express = require('express');
const { setComment, getComment, deleteComment, updateComment } = require('../../controllers/comments/commentsController');
const commentsRoute = express.Router();
const protected = require('../../middleware/protected')


// $COMMENT ROUTE
// >Creating : Comment
commentsRoute.post('/:id', protected, setComment)


// >Fetch single : comment
commentsRoute.get('/:id', getComment)


// >Delete single : comment
commentsRoute.delete('/:id', protected, deleteComment)

// >Update single : comment
commentsRoute.put('/:id', updateComment)

module.exports = commentsRoute;