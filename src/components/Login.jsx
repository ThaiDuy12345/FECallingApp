import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
export default function Login() {
  const [account, setAccount] = useState({
    email: '',
    password: ''
  })
  const email = useRef()
  const password = useRef()
  const Login = () => {
    axios.post("https://sirikakire-chat.herokuapp.com/api/Account/getAccount", {
        email: email.current.value,
        password: password.current.value
    }).then(res => {
      if(res.data === null){
        alert("Đăng nhập thất bại")
        return
      }
      alert("Đăng nhập thành công")
      sessionStorage.setItem("AccountID", res.data._id)
      window.location.reload()
    })
  }
  return (
    <div className="Login w-50 m-auto center" style={{height: '100vh'}}>
      <div className="row m-0 p-0">
        <div className="col-12 row m-0 mb-4 p-0">
          <b className="col m-auto center" style={{fontSize:'30px'}}>SiriBlogger</b>
        </div>
        <div className="col-12 row m-0 mb-4 p-0">
          <input ref={email} className="form-control col-8 m-auto mb-2" type="text" placeholder="Email"/>
          <input ref={password} className="form-control col-8 m-auto mb-2" type="password" placeholder="Mật khẩu"/>
        </div>
        <div className="col-12 row m-0 mb-4 p-0">
          <button onClick={Login} className="btn btn-success col-12 m-auto font-weight-bold">Đăng nhập</button>
        </div>
        <div className="col-12 row m-0 mb-4 p-0">
          <Link to="/forgot" className="text-primary col-6 m-auto" style={{textAlign:'left'}}>Quên mật khẩu</Link><Link to="/signin" className="col-6 m-auto text-primary" style={{textAlign:'right'}}>Chưa có tài khoản? Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  )
}
