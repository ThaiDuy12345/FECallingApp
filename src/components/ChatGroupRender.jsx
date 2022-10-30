import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Moment from 'moment'
import Icon from '../Data/Icon'
import io from 'socket.io-client'
import api from '../API/api'
export default function ChatGroupRender({Objects, allGroups, setAllGroups}){
    const socket = useRef()
    let { id } = useParams()
    const message = useRef()
    const navigate = useNavigate()
    const element = useRef()
    const submitButton = useRef()
    const sendIcon = useRef()
    const [data, setData] = useState(Icon)
    const [allMessages, setAllMessages] = useState([])
    useEffect(() => {
        element.current.scrollTop = element.current.scrollHeight
    })
    useEffect(() => {
        socket.current = io("https://sirikakire-chat.herokuapp.com/")
        socket.current.on('user-chat', (message) => {
            if(
                message.to_id === id
            ){
                setAllMessages(oldArray => [...oldArray, message])
                console.log(allMessages.length)
            }
        })
        return () => {
            socket.current.disconnect()
        }
    }, [id, allMessages])
    useEffect(() => {
        const to = sessionStorage.getItem('AccountID')
        axios.post(api.getGroupMessagesChat, {
            user1_id: to,
            user2_id: id
        }).then(res => {
            setAllMessages(res.data)
        })
    }, [id])
    const GetName = () => {
        if(Objects.length === 0) return <></>
        return(
            <b>
                {Objects.find(group => group._id === id).name}
            </b>
        )
    }
    const sendMessage = () => {
        socket.current.emit('on-chat',{
            type: 'g',
            chatDate: new Date(),
            content:  message.current.value,
            from_id: sessionStorage.getItem('AccountID'),
            to_id: id
        })
        message.current.value = ''
    }
    const submit = (event) => {
        if(event.which === 13) {
            if(message.current.value.length !== 0){
                sendMessage()
            }
        }
    }
    const buttonChange = (event) => {
        if(message.current.value.length > 0){
            setTimeout(
                () => {
                    submitButton.current.style.background = ''
                    submitButton.current.style.border = ''   
                    submitButton.current.style.width = '12%'
                },
                100,
            );
            setTimeout(
                () => {
                    sendIcon.current.style.display = 'var(--fa-display, inline-block)';
                },
                150,
            );
            setTimeout(
                () => {
                    submitButton.current.style.display = 'block'
                },
                50,
            );
            message.current.style.width = "80%"
        }else{
            sendIcon.current.style.display = 'none';
            submitButton.current.style.display = 'none'
            submitButton.current.style.background = 'none'
            submitButton.current.style.border = 'none'
            submitButton.current.style.width = '0%'
            message.current.style.width = "95%"
        }
    }
    const MessageRender = (message) => {
        if(message.message.content === "Không hiển thị nội dung vì người dùng đã rời khỏi nhóm")
        return(
            <div className="rounded m-0 mb-5 p-2 bg-secondary" style={{maxWidth:'100%',width:'max-content', height:'max-content'}}>
                <div className="text-light" style={{maxWidth:'100%',width:'max-content', height:'max-content'}}>
                    <div className="text-start">
                        <FontAwesomeIcon icon="fa-solid fa-user" />&nbsp;<span className="fw-bold">{message.message.from_id.name}</span> - <span className="text-light">{Moment(message.message.chatDate).format('DD-MM-yyyy')}</span>
                    </div>
                    <div className="text-start" style={{maxWidth:'100%'}}>
                        <span className="text-decoration-line-through" style={{maxWidth:'100%', wordWrap:'break-word'}}>{message.message.content}</span>
                    </div>
                </div>
            </div>
        )
        if(message.message.from_id._id === sessionStorage.getItem('AccountID'))
        return(
            <div className="rounded m-0 mb-5 p-2 bg-primary" style={{maxWidth:'100%',width:'max-content', height:'max-content'}}>
                <div className="text-light" style={{maxWidth:'100%',width:'max-content', height:'max-content'}}>
                    <div className="text-start">
                        <FontAwesomeIcon icon="fa-solid fa-user" />&nbsp;<span className="fw-bold">{message.message.from_id.name}</span> - <span className="text-light">{Moment(message.message.chatDate).format('DD-MM-yyyy')}</span>
                    </div>
                    <div className="text-start" style={{maxWidth:'100%'}}>
                        <span style={{maxWidth:'100%', wordWrap:'break-word'}}>{message.message.content}</span>
                    </div>
                </div>
            </div>
        )
        return(
            <div className="rounded m-0 mb-5 p-2 bg-light" style={{maxWidth:'100%',width:'max-content', height:'max-content'}}>
                <div className="text-dark" style={{marginLeft:'auto',maxWidth:'100%',width:'max-content', height:'max-content'}}>
                    <div className="text-start">
                        <FontAwesomeIcon icon="fa-solid fa-user" />&nbsp;<span className="fw-bold">{message.message.from_id.name}</span> - <span className="text-secondary">{Moment(message.message.chatDate).format('DD-MM-yyyy')}</span>
                    </div>
                    <div className="text-start" style={{maxWidth:'100%'}}>
                        <span style={{maxWidth:'100%', wordWrap:'break-word'}}>{message.message.content}</span>
                    </div>
                </div>
            </div>
        )
    }
    const leaveGroup = () => {
        axios.put(api.leaveGroup,{
            _id: sessionStorage.getItem("AccountID"),
            group_id: id
        }).then(res => {
            if(res.data === null){
                alert("Failed to leave the group, please try again")
                return
            }
            for(var i = 0; i < allGroups.length; i++){
                if(allGroups[i]._id === res.data._id){
                    allGroups.splice(allGroups.indexOf(allGroups[i]), 1)
                    setAllGroups([...allGroups])
                    navigate("/")
                    break
                }
            }
        })
    }
    const RenderIcon = ({Icon}) => {
        return (
            <>
                <button onClick={() => {
                    message.current.value = message.current.value + Icon
                }} className="col border-0 icon">{Icon}</button>
            </>
        )
    } 
    return(
        <div className="w-100 h-100 m-0 p-0 text-light">
            <div className="w-100 center m-0 p-0" style={{height:'15%',boxShadow:'0px 3px 3px #000316'}}>
                <div className="text-start" style={{width:'45%'}}>
                    <FontAwesomeIcon icon="fa-solid fa-people-group" />
                    &nbsp; <GetName/>
                </div>
                <div className="drop-down text-end" style={{width:'45%'}}>
                    <button className="settingButton" type="button" data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
                        <FontAwesomeIcon icon="fa-solid fa-bars" />
                    </button>
                    <ul className="dropdown-menu">
                        <span className="dropdown-item-text"><FontAwesomeIcon icon="fa-solid fa-plus" /> &nbsp;Group id: <b>{id}</b></span>
                        <button className="dropdown-item text-danger" onClick={leaveGroup}><FontAwesomeIcon icon="fa-solid fa-right-from-bracket" /> &nbsp;Leave this group</button>
                    </ul>
                </div>
            </div>
            <div className="w-100 center m-0 pt-3 pb-3 ps-2 pe-2" style={{height:'70%'}}>
                <div ref={element} className="w-100 h-100 text-start" style={{overflowY:'auto'}}>
                    {
                        allMessages.map(message => <MessageRender key={message._id} message={message}/>)
                    }
                </div>
            </div>
            <div className="w-100 center m-0 p-0" style={{height:'15%'}}>
                <div className="text-start row" style={{width:'95%'}}>
                    <div className="drop-down m-0 p-0" style={{width:'5%'}}>
                        <button data-bs-toggle="dropdown" aria-expanded="false" className="h-100 w-100 fs-5 m-0 p-0 border-0 text-light" style={{background:'none'}}><FontAwesomeIcon icon="fa-solid fa-face-smile" /></button>
                        <div className="dropdown-menu" style={{maxWidth:"250px"}}>
                            {data.map(icon => <RenderIcon key={icon} Icon={icon}/>)}
                        </div>
                    </div>
                    <input onKeyDown={event => submit(event)} onKeyUp={buttonChange} ref={message} className="me-auto fw-bold rounded-3" style={{transition:'0.1s',padding:'5px',width:'95%',background:'none', border:'0.5px solid white'}}/>
                    <button onClick={sendMessage} ref={submitButton} className="btn ms-auto btn-success text-center text-light rounded-3" style={{display:'none',transition:'0.1s',padding:'5px',width:'0%', background:'none', border:'none'}}><FontAwesomeIcon style={{display:'none'}} ref={sendIcon} icon="fa-solid fa-paper-plane" /></button>
                </div>
            </div>
        </div>
    )
}