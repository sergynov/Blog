import { UserRow } from "./components";
import { TableRow } from "./components";
import { useEffect, useState } from "react";
import { PrivateContent } from "../../components";
import { ROLE } from "../../../constants";
import { checkAccess } from "../../utils";
import { useSelector } from "react-redux";
import { selectUserRole } from "../../selectors";
import styled from "styled-components";
import { request } from "../main/utils";

const UsersContainer = ({className}) => {
  const [users,setUsers] = useState([]);
  const [roles,setRoles] = useState([])
  const [errorMessage,setErrorMessage] = useState(null)
  const [shouldUpdateUserList, setShouldUpdateUserList] = useState(false)
  const userRole = useSelector(selectUserRole)


    useEffect(() => {

      if(!checkAccess([ROLE.ADMIN],userRole)) {
        return;
      }

      Promise.all([
        request('/users'),
        request('/users/roles')
      ]).then(([usersRes, rolesRes])=>{
        if(usersRes.error || rolesRes.error) {
          setErrorMessage(usersRes.error || rolesRes.error)
          return 
          }
        setRoles(rolesRes.data)
        setUsers(usersRes.data)
      })
    },[shouldUpdateUserList, userRole])

    const onUserRemove = (userId) => {
      if(!checkAccess([ROLE.ADMIN],userRole)) {
        return;
      }
      request(`/users/${userId}`,'DELETE')
      .then(()=>{
        setShouldUpdateUserList(!shouldUpdateUserList)
      })
    }


  return(
    <>
    <div className={className}>
      <PrivateContent access={[ROLE.ADMIN]} serverError={errorMessage}>
      <h2>Users</h2>
      <div>
        <TableRow>
          <div className="login-column">Login</div>
          <div className="date-column">Date of registration</div>
          <div className="role-column">Role</div>
        </TableRow>
        {users.map(({id,login,roleId,registered_at})=> (
          <UserRow key={id} id={id} login={login} 
          registered_at={registered_at} roleId={roleId} onUserRemove={()=>onUserRemove(id)}
          roles={roles.filter(({id:roleId}) => roleId !== ROLE.GUEST)} ></UserRow>
        ) )}
        
      </div>
      </PrivateContent>
    </div>
    </>
  )
}


export const Users = styled(UsersContainer)`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  `;