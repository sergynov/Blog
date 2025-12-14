import { ACTION_TYPE } from "./action-types";
import { request } from "../pages/main/utils/request";

export const logout = () => {

  request('/logout','POST')

  return {
    type: ACTION_TYPE.LOGOUT
  }
}