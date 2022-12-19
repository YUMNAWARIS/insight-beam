import './UploadBook.css'
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/auth'

function Upload() {
    const { getToken, getUser, saveUser } = useAuth();
    const [upload, setupload] = useState({
        title: '',
        author: '',
        description: '',
        publisher: '',
        ISBN: '',
        purchase_link: '',
        image_link: ''
    });

    const [Error, setError] = useState('');
    const [succcess, setSucccess] = useState("");

    function inputHandler(e) {
        const name = e.target.name
        const value = e.target.value
        setupload({ ...upload, [name]: value })
    }

    function submitHandler(e) {
        e.preventDefault();
        const config = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            },
            body: JSON.stringify(upload)
        }
        fetch('http://localhost:4000/book/', config)
            .then(result => {
                return result.json()
            })
            .then(data => {
                if (data.Message) {
                    const user = getUser()
                    user.created_books.push(data.New_Book)
                    saveUser(JSON.stringify(user))
                    setupload({ ...upload, ['title']: '', ['author']: '', ['publisher']: '', ['description']: '', ['ISBN']: '' })
                    setSucccess(data.Message)
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
        <div className='upload-container' >
            <form className="add-form-container" onSubmit={submitHandler}>
                {Error && <p className="error-message">{Error}</p>}
                {succcess && <p className="success-message">{succcess}</p>}
                <h2>Upload a Book</h2>
                <input type="text" placeholder="Enter book title"
                    value={upload.title} onChange={inputHandler} required name='title'
                />
                <input type="text" placeholder="Enter Author Name..."
                    value={upload.author} onChange={inputHandler} required name='author' />
                <input type="text" placeholder="Enter Publishers Name..."
                    value={upload.publisher} onChange={inputHandler} required name='publisher' />
                <input type="text" placeholder="Enter ISBN Name..."
                    value={upload.ISBN} onChange={inputHandler} required name='ISBN' />
                <input type="text" placeholder="Enter Book Link for purchase if any"
                    value={upload.purchase_link} onChange={inputHandler} name='purchase_link' />
                <textarea placeholder="What this book is about???" rows="5"
                    value={upload.description} onChange={inputHandler} required name='description'
                ></textarea>
                <button type='submit' className="btn">Upload...</button>
            </form>
        </div>
    )
}
export default Upload