module.exports = function (comment) {
  return {
    content: comment.content,
    author: comment.author.email,
    id: comment._id,
    publishedAt: comment.createdAt
  }
}