const bcrypt = require('bcrypt')
const User = require('../models/User')
const {generate} = require('../helpers/token')
const ROLES = require('../constants/roles')


const  register = async (login,password) => {
  if(!password) {
    throw new Error('Password is empty')
  }
  console.log('usercontoller',login,password)
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({login, password: passwordHash})

  const token = generate({id:user.id})

  return {user,token}
}


const login = async (login,password) => {
  const user = await User.findOne({login})

  if(!user) {
    throw new Error('User not found')
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if(!isPasswordMatch) {
    throw new Error('Wrong passwrod')
  }

  const token = generate({id:user.id})

  return {token, user}
}

const getUsers = () => {
  return User.find()
}

const getRoles = () => {
  return [
    {id: ROLES.ADMIN, name: 'Adminstrator'},
    {id: ROLES.MODERATOR, name: 'Moderator'},
    {id: ROLES.USER, name: 'User'},
  ]
}

// delete user

const deleteUser = (id) => {
  return User.deleteOne({_id: id})
}

// edit roles

const updateUser = (id, userData) => {
  return User.findByIdAndUpdate(id,userData, {returnDocument: 'after'})
}

module.exports = {
  register, login, getUsers, getRoles, deleteUser, updateUser
}