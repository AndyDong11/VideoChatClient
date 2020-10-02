import React, { useState } from 'react'
import Axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

export default function Register(props) {

    const doneTypingInterval = 500
    let [name, setName] = useState('')
    let [typingTimer, setTypingTimer] = useState()
    let [nameStatus, setNameStatus] = useState(-1)
    let [checkCount, setCheckCount] = useState(0)

    let getNameStatus = () => {
        console.log(checkCount)
        if (nameStatus === 0 || checkCount > 0) return <div className="spinning-loader"></div>
        else if (nameStatus === 1 && checkCount === 0) return <FontAwesomeIcon icon='check' color='green' />
        else if (nameStatus === 2 && checkCount === 0) return <FontAwesomeIcon icon='times' color='red' />
        return
    }

    let changeName = (e) => {
        let newName = e.target.value
        clearTimeout(typingTimer)
        if (newName !== '') {
            setTypingTimer(setTimeout(() => {
                setCheckCount(checkCount => checkCount + 1)
                setNameStatus(0)
                Axios.get('http://localhost:3001/register/checkUsername', { params: { name: newName } })
                    .then(res => { setCheckCount(checkCount => checkCount - 1); setNameStatus(res.data.num) })
            }, doneTypingInterval))
        }
        else {
            setNameStatus(-1)
        }
        setName(newName)
    }

    let register = () => {
        Axios.get('http://localhost:3001/register', { params: { name: name } })
            .then(res => { props.history.push('/login') })
    }

    return (
        <div>
            <div className='container-fluid'>
                {
                    sessionStorage.getItem('user') ?
                        <div className='row header'>
                            <div><Link to='/login' >Logout</Link></div>
                        </div>
                        :
                        <div className='row header'>
                            <div><Link to='/login'>Login</Link></div>
                            <div><Link to='/register'>Register</Link></div>
                        </div>
                }
            </div>
            <div className='container-fluid'>
                <div className='vh-center'>
                    <label>Name</label>
                    <input type='text' value={name} onChange={changeName}></input>
                    {getNameStatus()}
                </div>
                <div className='vh-center'>
                    <button disabled={nameStatus !== 1} onClick={register}>Register</button>
                </div>
            </div>
        </div>
    )
}