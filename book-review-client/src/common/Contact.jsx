import './Contact.css'
import { useState } from 'react';

function Contact() {

    const [contact, setContact] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [Error, setError] = useState('');
    const [succcess, setSucccess] = useState("");

    function inputHandler(e) {
        const name = e.target.name
        const value = e.target.value
        setContact({ ...contact, [name]: value })
    }

    function submitHandler(e) {
        e.preventDefault()
        const config = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contact)
        }
        fetch('http://localhost:4000/contact', config)
            .then(result => {
                return result.json()
            })
            .then(data => {
                console.log(data)
                if (data.message) {
                    setContact({ ...contact, ['message']: '',['name']:'',['email']:'' })
                    
                    setSucccess(data.message)
                }
                else {
                    setError(data.Error_message)
                }
            })
            .catch(error => {
                setError(error.message)
            })
    }

    return (

        <div className='container' >

            <form className="contact-form-container" onSubmit={submitHandler}>
                {Error && <p className="error-message">{Error}</p>}
                {succcess && <p className="success-message">{succcess}</p>}
                <h2>Contact Us</h2>
                
                <input type="text" placeholder="Enter your name"
                    value={contact.name} onChange={inputHandler} required name='name'
                />

                <input type="email" placeholder="Enter your email"
                    value={contact.email} onChange={inputHandler} required name='email' />

                <textarea placeholder="Enter your message...." rows="5"
                    value={contact.message} onChange={inputHandler} required name='message'
                ></textarea>
                <button type='submit' className="btn">Send...</button>
            </form>
        </div>

    )
}
export default Contact