import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../components/Login'
import Signin from '../components/Signin'
import MainBody from '../components/MainBody'
import axios from 'axios'
export default function Body() {
  const [loggedIn, setLoggedIn ] = useState()
  useEffect(() => {
    setLoggedIn(checking)
  }, [])
  const checking = () => {
    if(localStorage.getItem('AccountID') == null){
      console.log('null localstorage')
      return false
    }else{
      axios.get(`https://sirikakire-chat.herokuapp.com/api/Account/getAccountWithId/${localStorage.getItem("AccountID")}`)
      .then(res => {
        if (res.data == null) {
          console.log('id not found') 
          return false
        }else{
          console.log('id found') 
          return true
        }
      })
    }
  }
  return (
    <Routes>
      <Route path="*" element={loggedIn === false? <Navigate to="/login"/>:<MainBody/>}/>
      <Route path="/login" element={loggedIn === false? <Login/>:<Navigate replace to="/"/>} />
      <Route path="/signin" element={loggedIn === false? <Signin/>:<Navigate to="/"/>} />
    </Routes>
  )
}
