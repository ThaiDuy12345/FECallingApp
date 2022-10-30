import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams } from 'react-router-dom'
import api from '../API/api'
import axios from 'axios'
import Icon from '../Data/Icon'
import sound from "../Data/Sound.mp3"
import io from 'socket.io-client'
export default function ChatDMRender({Objects}){
    const socket = useRef()
    let { id } = useParams();
    const message = useRef();
    const element = useRef();
    const submitButton = useRef();
    const sendIcon = useRef();
    const [allMessages, setAllMessages] = useState([])
    const [data, setData] = useState(Icon)
    const [volume, setVolume] = useState(true)
    useEffect(() => {
        element.current.scrollTop = element.current.scrollHeight;
    })
    useEffect(() => {
        socket.current = io("https://sirikakire-chat.herokuapp.com/")
        socket.current.on('user-chat', (message) => {
            if(
                (
                    message.from_id._id === sessionStorage.getItem('AccountID')
                    &&
                    message.to_id === id
                )
                ||
                (
                    message.to_id === sessionStorage.getItem('AccountID')
                    &&
                    message.from_id._id === id
                )
            ){
                setAllMessages(oldArray => [...oldArray, message])
                if(message.from_id._id !== sessionStorage.getItem('AccountID') && volume === true){
                    const audio = new Audio(sound);
                    audio.play()
                    .then(() => console.log("play audio successfully"))
                    .catch(() => console.log("play audio failed"))
                }
                console.log(allMessages.length)
            }
        })
        return () => {
            socket.current.disconnect()
        }
    }, [id, allMessages, volume])
    useEffect(() => {
        const to = sessionStorage.getItem('AccountID')
        axios.post(api.getDMMessagesChat, {
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
                {Objects.find(account => account._id === id).name}
            </b>
        )
    }
    const sendMessage = () => {
        socket.current.emit('on-chat',{
            type: 'dm',
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
    const VolumeRender = () => {
        return (
            <button className="dropdown-item fw-bold text-success" onClick={() => setVolume(false)}>Sound on &nbsp;<FontAwesomeIcon icon="fa-solid fa-volume-high"/></button>
        )
        
    }
    const MuteVolumeRender = () => {
        return (
            <button className="dropdown-item fw-bold text-danger" onClick={() => setVolume(true)}>Mute &nbsp;<FontAwesomeIcon icon="fa-solid fa-volume-xmark"/></button>
        )
    }
    const buttonChange = (event) => {
        if(message.current.value.length !== 0){
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
    const RenderIcon = ({Icon}) => {
        return (
            <>
                <button onClick={() => {
                    message.current.value = message.current.value + Icon
                }} className="col border-0 icon" style={{background:'none'}}>{Icon}</button>
            </>
        )
    } 
    const timeSince = (date) => {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = seconds / 31536000;
        if (interval > 1) {
          return Math.floor(interval) + " năm trước";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " tháng trước";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + " ngày trước";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " tiếng trước";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " phút trước";
        }
        return Math.floor(seconds) + " giây trước";
    }
    const MessageRender = (message) => {
        if(message.message.from_id._id === sessionStorage.getItem('AccountID'))
        return(
            <div className="rounded m-0 mb-5 p-2 bg-primary" style={{maxWidth:'100%',width:'max-content', height:'max-content'}}>
                <div className="text-light" style={{maxWidth:'100%',width:'max-content', height:'max-content'}}>
                    <div className="text-start">
                        <FontAwesomeIcon icon="fa-solid fa-user" />&nbsp;<span className="fw-bold">{message.message.from_id.name}</span> - <span className="text-light">{timeSince(new Date(message.message.chatDate))}</span>
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
                        <FontAwesomeIcon icon="fa-solid fa-user" />&nbsp;<span className="fw-bold">{message.message.from_id.name}</span> - <span className="text-secondary">{timeSince(new Date(message.message.chatDate))}</span>
                    </div>
                    <div className="text-start" style={{maxWidth:'100%'}}>
                        <span style={{maxWidth:'100%', wordWrap:'break-word'}}>{message.message.content}</span>
                    </div>
                </div>
            </div>
        )
    }
    return(
        <div className="w-100 h-100 m-0 p-0 text-light">
            <div className="w-100 center m-0 p-0" style={{height:'15%',boxShadow:'0px 3px 3px #000316'}}>
                <div className="text-start dotText" style={{width:'45%'}}>
                    <FontAwesomeIcon icon="fa-solid fa-user" />
                    &nbsp; <GetName/>
                </div>
                <div className="drop-down text-end" style={{width:'45%'}}>
                    <button className="settingButton" type="button" data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
                        <FontAwesomeIcon icon="fa-solid fa-bars" />
                    </button>
                    <ul className="dropdown-menu">
                        {volume === true? <VolumeRender />:<MuteVolumeRender />}
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
                <div className="text-start row " style={{width:'95%'}}>
                    <div className="drop-down m-0 p-0" style={{width:'5%', minWidth:'20px'}}>
                        <button data-bs-toggle="dropdown" aria-expanded="false" className="h-100 w-100 fs-5 m-0 p-0 border-0 text-light" style={{background:'none'}}><FontAwesomeIcon icon="fa-solid fa-face-smile" /></button>
                        <div className="dropdown-menu" style={{maxWidth:"250px"}}>
                            {data.map(icon => <RenderIcon key={icon} Icon={icon}/>)}
                        </div>
                    </div>
                    <input ref={message} onKeyDown={event => submit(event)} onKeyUp={buttonChange} className="me-auto fw-bold rounded-3" style={{width:"90%",transition:'0.1s',padding:'5px',background:'none', border:'0.5px solid white'}}/>
                    <button onClick={sendMessage} ref={submitButton} className="btn ms-auto btn-success text-center text-light rounded-3" style={{display:'none',transition:'0.1s',padding:'5px',width:'0%', background:'none', border:'none'}}><FontAwesomeIcon style={{display:'none'}} ref={sendIcon} icon="fa-solid fa-paper-plane" /></button>
                </div>
            </div>
        </div>
    )
}
