
import './MyBook.css'
import BookView from "../../views/book-view";
import { useState, useEffect } from "react";

function MyBooks(props) {
    const user = props.user
    const token = props.token
    const [books, setbook] = useState("")
    useEffect(() => {
        const config = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            }
        }
        fetch(`http://localhost:4000/book/mybooks`, config)
            .then(res => {
                return res.json()
            })
            .then(data => {
                const data_books = JSON.stringify(data.books)
                setbook(data_books)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    return (

        <div className="book-container">
            {!books ?
                <h4 className="no-book-message">Share your favorite book collections with others and get reviews NOW...</h4>
                : JSON.parse(books).map((book, index) => {
                    return (
                        <div id='one-book' key={book.id}>
                            <BookView book={book}  user={user} token={token} />
                        </div>
                    )
                })}


        </div>
    )
}

export default MyBooks