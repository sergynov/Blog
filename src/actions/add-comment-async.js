import { request } from "../pages/main/utils"
import { addComment } from "./add-comment"

export const addCommentAsync = (postId, content) => (dispatch) => {

  request(`/posts/${postId}/comments`,'POST',{content})
      .then((comment)=>{
        dispatch(addComment(comment.data))
      })
}