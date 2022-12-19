import './loginregistration.css'
import { useState } from 'react';
import useAuth from '../hooks/auth';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate()
    const { saveToken, saveUser } = useAuth()

    const [NewUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        bio: ''
    });

    const [Error, setError] = useState('');

    function inputHandler(e) {
        const name = e.target.name
        const value = e.target.value
        setNewUser({ ...NewUser, [name]: value })

    }

    function submitFormHandler(e) {
        e.preventDefault()
        const config = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(NewUser)
        }

        fetch('http://localhost:4000/user/signup', config)
            .then(result => {
                return result.json()
            })
            .then(data => {
                console.log(data)
                if (data.Authentication_Token) {
                    saveToken(data.Authentication_Token)
                    saveUser(JSON.stringify(data.user))
                    navigate('/')
                }
                else {
                    setError(data.Error_Message)
                }
            })
            .catch(error => {
                setError(error.message)
            })

    }
    return (
        <div className="container-auth-form">

            <form className="form" onSubmit={submitFormHandler}>

                {Error && <p className="error-message">{Error}</p>}

                <p className="heading">Registeration</p>

                <div className="form-content">
                    <div className='flex'>
                        <i className='fa fa-user icon'></i>
                        <input className="input-field" type="text" placeholder="Enter your name"
                            value={NewUser.name} onChange={inputHandler} name='name' required
                        />
                    </div>
                    <div className='flex'>

                        <i className='fa fa-envelope icon'></i>
                        <input className="input-field" type="email" placeholder="Enter your email"
                            value={NewUser.email} onChange={inputHandler} name='email' required
                        />
                    </div>

                    <div className='flex'>
                        <i className='fa fa-lock icon'></i>
                        <input className="input-field" type="password" placeholder="Enter a password"
                            value={NewUser.password} onChange={inputHandler} name='password' required
                        />
                    </div>

                    <div className='flex'> 
                        <i className='fas fa-pencil-alt'></i>
                        <input className="input-field" type="textarea" placeholder="Write something about yourself..."
                            value={NewUser.bio} onChange={inputHandler} name='bio' required
                        />
                    </div>

                    <div id="remember-frgt-field">
                        <div>
                            <input type="checkbox" required /> <span>I accept all terms and conditions</span>
                        </div>
                    </div>

                    <button className="btn">Register Now</button>
                </div>
            </form>
        </div>
    )
}

export default Register