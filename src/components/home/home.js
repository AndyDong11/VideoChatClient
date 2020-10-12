import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import { useUserMedia } from './video'

let socket = io('http://localhost:3001')

const CAPTURE_OPTIONS = {
    audio: false,
    video: { facingMode: "environment" },
};

export default function Home() {

    let [messageList, setMessageList] = useState([])
    let [message, setMessage] = useState('')
    const videoRef = useRef()
    const mediaStream = useUserMedia(CAPTURE_OPTIONS)
    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
      }

    useEffect(() => {
        socket.on('newmessage', (data) => { setMessageList(oldMessages => [...oldMessages, data]) })
    }, [])

    useEffect(() => {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => { console.log(stream) })
    }, [])

    let sendMessage = () => {
        socket.emit('message', message)
        setMessage('')
    }

    const constraints = {
        'video': true,
        'audio': true
    }

    return (
        <div>
            <div className='container-fluid'>
                {
                    sessionStorage.getItem('user') ?
                        <div className='row header'>
                            <div><Link to='/login' onClick={() => { sessionStorage.removeItem('user') }}>Logout</Link></div>
                        </div>
                        :
                        <div className='row header'>
                            <div><Link to='/login'>Login</Link></div>
                            <div><Link to='/register'>Register</Link></div>
                        </div> 
                }
            </div>
            <div>
                <div>
                    {
                        messageList.map((message, idx) => <div key={idx}>{message}</div>)
                    }
                </div>
                <div>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
            <div>
                <video ref={videoRef} autoPlay playsInline controls={false} mute />
            </div>
            <div>
                <Link to='/videochat'>Join video chat</Link>
            </div>
        </div>
    )
}