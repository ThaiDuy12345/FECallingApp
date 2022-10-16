import React, { useState, useRef } from 'react'
import axios from 'axios'
export default function Signin() {
  const [account, setAccount] = useState(
    { email: '', password: '', username: '' }
  )
  const email = useRef()
  const password = useRef()
  const username = useRef()
  const SigninFunction = () => {
    alert(`${account.email}, ${account.password}, ${username.current.value}`)
    axios.post("https://sirikakire-chat.herokuapp.com/api/Account/getAccount", {
        email: account.email,
        password: account.password
    }).then(res => {
      if(res.data === null){
        axios.post("https://sirikakire-chat.herokuapp.com/api/Account/createAnAccount", {
          email: account.email,
          password: account.password,
          username: username.current.value
        }).then(res => {
          if(res.data === null){
            return
          }
          alert("Tạo tài khoản thành công")
          localStorage.setItem("AccountID", res.data._id)
          window.location.reload();
        })
      }else{
        alert("Đăng nhập thất bại")
        return
      }
    })
  }
  function Page1(){
    return (
      <>
        <div className="col-12 row m-0 mb-4 p-0">
            <input ref={email} className="form-control col-12 m-auto mb-2" type="text" placeholder="Email"/>
            <input ref={password} className="form-control col-12 m-auto mb-2" type="password" placeholder="Mật khẩu"/>
        </div>
        <div className="col-12 row m-0 mb-4 p-0">
          <div className="col-10 m-0"></div>
          <div className="col-2 p-0 m-0">
            <button onClick={() => setAccount({
              email: email.current.value,
              password: password.current.value,
              username: '',
            })}className="text-primary fw-bold" style={{border:'none', background:'none'}}>Tiếp tục</button>
          </div>
        </div>
      </>
    )
  }
  function Page2(){
    return(
      <>
        <div className="col-12 row m-0 mb-4 p-0">
            <div className="text-start col-12 m-auto mb-1 text-secondary fw-bold">Thông tin đăng nhập</div>
            <input disabled value={account.email} className="form-control col-12 m-auto mb-2" type="text" placeholder="Tên đăng nhập hoặc email"/>
            <input disabled value={account.password} className="form-control col-12 m-auto mb-2" type="password" placeholder="Mật khẩu"/>
        </div>
        <div className="col-12 row m-0 mb-4 p-0">
            <div className="text-start col-12 m-auto mb-1 text-secondary fw-bold">Thông tin chi tiết</div>
            <input ref={username} className="form-control col-12 m-auto mb-2" type="text" placeholder="Tên người dùng (Tên mà mọi người sẽ thấy bạn)"/>
        </div>
        <div className="col-6 row me-auto mb-4 p-0">
          <button onClick={() => setAccount()} className="btn btn-danger fw-bold">Quay lại</button>
        </div>
        <div className="col-6 row ms-auto mb-4 p-0">
          <button onClick={SigninFunction} className="btn btn-success fw-bold">Đăng ký tài khoản</button>
        </div>
      </>
    )
  }
  return (
    <div className="Signin w-50 m-auto center" style={{height: '100vh'}}>
      <div className="row m-0 p-0">
        <div className="col-12 row m-0 mb-4 p-0">
          <b className="col m-auto center" style={{fontSize:'30px'}}>SiriBlogger</b>
        </div>
        {account.email === ""? <Page1/>:<Page2/>}
      </div>
    </div>
  )
}
