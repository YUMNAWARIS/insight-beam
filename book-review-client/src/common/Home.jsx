import BookView from "../views/book-view";
import { useState, useEffect } from "react";
import "./Home.css"

function Home(props) {
    const user = props.user
    const token = props.token
    const [books, setbook] = useState("")
    const [rendered_books, setRendered] = useState("")
    const [searched, setSearch] = useState("")
    const [Searched_msg, setSearchMsg] = useState("")
    const [filter_value, setFilterValue] = useState("title")

    useEffect(() => {
        const config = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }
        fetch(`http://localhost:4000/book/`, config)
            .then(res => {
                return res.json()
            })
            .then(data => {
                if (data.Books.length == 0) {
                } else {
                    const data_books = JSON.stringify(data.Books)
                    setbook(data_books)
                    setRendered(data_books)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    function inputHandler(e) {
        e.preventDefault()
        setSearch(e.target.value);
    }

    function searchBook(e) {
        e.preventDefault()
        let search_value = searched;

        if (search_value === '') {
            setRendered(books)
            setSearchMsg('')
        }
        else {
            let total_books = JSON.parse(books);
            let searched_books = [];

            if (filter_value == 'author') {
                total_books.map((book, index) => {
                    if (book.author.toLowerCase().includes(search_value.toLowerCase())) {
                        searched_books.push(book)
                    }
                });
            }
            else {
                total_books.map((book, index) => {
                    if (book.title.includes(search_value)) {
                        searched_books.push(book)
                    }
                });
            }

            if(searched_books.length==0){
                setSearchMsg('No Book Match found... Please try again...')
            }else{
                setSearchMsg("Match found...")
            }

            const data_books = JSON.stringify(searched_books)
            setRendered(data_books)
        }
    }

    function setFilter(e) {
        setFilterValue(e.target.value)
    }

    return (

        <div className="book-container">
            <div className="search-container">
                <form onSubmit={searchBook}>
                    <input type="text" placeholder="Search a book by its name..." value={searched} onChange={inputHandler} />
                    <button type="submit"><i className="fa fa-search"></i></button>
                </form>
                <div className="filter-flex">
                    <h5 className="filter-flex-item">Filter By</h5>
                    <div className="filter-flex-item">
                        <input type='radio' value='title' name='filter' onClick={setFilter} />
                        <label>Name</label>
                    </div>
                    <div className="filter-flex-item">
                        <input type='radio' value='author' name="filter" onClick={setFilter} />

                        <label>Author </label>
                    </div>
                </div>
            </div>

            {Searched_msg ? <h4 className="no-book-message">{Searched_msg}</h4> : <p></p>}
            {!rendered_books ? <h4>Please Wait for a while... No books are available...</h4> : JSON.parse(rendered_books).sort((a, b) => (a.like_count < b.like_count) ? 1 : ((b.like_count < a.like_count) ? -1 : 0)).map((book, index) => { return (
                <div className="home-container-book"  key={book._id} >
                    <BookView book={book} user={user} token={token} />
                </div>
            
            ) })}
        </div>
    )
}

export default Home 