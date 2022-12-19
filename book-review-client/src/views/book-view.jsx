
import './book-view.css'
import { useState, useEffect } from 'react';
import useAuth from '../hooks/auth'
import { Link } from 'react-router-dom'


function BookView(props) {

    const { saveUser } = useAuth();
    const book = props.book
    const token = props.token
    const user = props.user

    const [like_count, setLike_count] = useState(book.like_count);
    const [like, setLike] = useState(false)

    function likelogic(e) {
        e.preventDefault()
        const config = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
        }
        fetch(`http://localhost:4000/like/${book._id}`, config)
            .then(res => {
                return res.json()
            })
            .then(data => {
                if (!data.Error) {
                    setLike_count(like_count + 1)
                    setLike(true)
                    user.liked_books.push(book)
                    saveUser(JSON.stringify(user))
                }
            })
            .catch(err => {
                console.log(err)
            })

    }
    function unlike(e) {
        e.preventDefault()
        const config = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
        }
        fetch(`http://localhost:4000/like/${book._id}`, config)
            .then(res => {
                return res.json()
            })
            .then(data => {
                if (!data.Error) {
                    user.liked_books.pop(book)
                    saveUser(JSON.stringify(user))
                    setLike(false)
                    setLike_count(like_count - 1)
                }
            })
            .catch(err => {
                console.log(err)
            })

    }
    useEffect(() => {
        if (token) {
            for (let i = 0; i < user.liked_books.length; i++) {
                if (user.liked_books[i]._id == book._id) {
                    setLike(true)
                }
            }
        }
    }, []);


    return (
        <div className='book-div'>
            <div>
                <div className='book-head'>
                    <h2>{book.title}</h2>
                    <h3>{book.author}</h3>
                </div>
                <div className="book-meta">
                    <h5>Published By: {book.publisher}</h5>
                    <h5>ISBN: {book.ISBN}</h5>
                </div>
            </div>
            <div className='book-detail'>
                <p>{book.description}</p>
            </div>
            <div className='book-footer'>
                <h3><a href={book.purchase_link}>Buy Now</a></h3>

                {
                    token ?

                        (
                            like ?
                                <button onClick={unlike} className="liked"><i className="fas fa-thumbs-up"></i> {like_count} </button>
                                :
                                <button onClick={likelogic}><i className="far fa-thumbs-up"></i> {like_count} </button>
                        )

                        :

                        <button><Link to='/login'><i className="fa fa-thumbs-up"></i> {book.like_count} </Link></button>
                }





                {/* {token ? 
                <button onClick={like}><i className="fa fa-thumbs-up"></i> {like_count}</button>
                : 
                <button><Link to='/login'>Likes: {book.like_count} </Link></button>}
                {token ? 
                <button onClick={unlike}><i className="fa fa-thumbs-down"></i> {"dislike"}</button>
                : 
                <button><Link to='/login'> {"dislike"} </Link></button>} */}
            </div>
        </div>
    )
}

export default BookView