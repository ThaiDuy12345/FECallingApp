import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../components/Login'
import Signin from '../components/Signin'
import MainBody from '../components/MainBody'
import axios from 'axios'
export default function Body() {
  const [loggedIn, setLoggedIn ] = useState(false)
  useEffect(() => {
    setLoggedIn(checking)
  }, [])
  const checking = () => {
    if(sessionStorage.getItem('AccountID') == null){
      console.log('null sessionStorage')
      return false
    }else{
      axios.get(`https://sirikakire-chat.herokuapp.com/api/Account/getAccountWithId/${sessionStorage.getItem("AccountID")}`)
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
      <Route path="/login" element={loggedIn === false? <Login/>:<Navigate to="/"/>} />
      <Route path="/signin" element={loggedIn === false? <Signin/>:<Navigate to="/"/>} />
    </Routes>
  )
}
