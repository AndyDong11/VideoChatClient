import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'

let socket = io('http://localhost:3001')

export default function Home() {

    let [messageList, setMessageList] = useState([])
    let [message, setMessage] = useState('')

    useEffect(() => {
        socket.on('newmessage', (data) => { setMessageList(oldMessages => [...oldMessages, data]) })
    }, [])

    let sendMessage = () => {
        socket.emit('message', message)
        setMessage('')
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
        </div>
    )
}