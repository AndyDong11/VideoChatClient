import Axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login(props) {

    let [name, setName] = useState('')

    let authenticateUser = () => {
        Axios.get('http://localhost:3001/login', { params: { name: name } })
            .then(res => {
                sessionStorage.setItem('user', res.data.name)
                props.history.push('/home')
            })
            .catch(err => {
                console.log('failed')
            })
    }

    return (
        <div>
            <div className='container-fluid'>
                {
                    sessionStorage.getItem('user') ?
                        <div className='row header'>
                            <div><Link to='/login'>Logout</Link></div>
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
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div className='vh-center'>
                    <button onClick={authenticateUser}>Login</button>
                </div>
            </div>
        </div>
    )
}