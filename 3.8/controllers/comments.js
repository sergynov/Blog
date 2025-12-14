const Comment = require('../models/Comment');
const Post = require('../models/Post');

//add
const addComment = async (postId, comment) =>{
  const newComment = await Comment.create(comment)
  await Post.findByIdAndUpdate(postId, {$push: {comments: newComment}})
  return newComment;
}
// remove

const deleteComment = async (postId,commentId)=> {
  await Comment.deleteOne({_id: commentId})
  await Post.findByIdAndUpdate(postId, {$pull: {comments: commentId}})
}

module.exports = {
  addComment, deleteComment
}