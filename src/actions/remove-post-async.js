import { request } from "../pages/main/utils";

export const removePostAsync = (id) => () => 
  request(`/posts/${id}`, 'DELETE',id)
