import BookView from "../../views/book-view";
import { useState, useEffect } from "react";
import './Likes.css'

function Liked(props) {
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
        fetch(`http://localhost:4000/book/mylikes`, config)
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
            {!books ? <h4 className="no-book-message">No Books in your like collection yet...</h4> : JSON.parse(books).map((book, index) => {
                return (
                    <div className="likes-container" key={book.id}>
                        <BookView book={book}  user={user} token={token} />
                    </div>
                )
            })}
        </div>
    )

}

export default Liked