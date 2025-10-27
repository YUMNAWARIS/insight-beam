import {useEffect,useState} from 'react'
import BookView from "../views/book-view";

function Recent(props){
    const user = props.user
    const token = props.token
    const [books, setbook] = useState("")
    useEffect(() => {
        const config = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }
        fetch(`http://localhost:4000/book/`,config)
        .then(res=>{
            return res.json()
        })
        .then(data=>{
            const length = data.Books.length
            let newArray
            if(length>4){
                 newArray = [data.Books[length-1],data.Books[length-2],data.Books[length-3],data.Books[length-4]]
            }
            else{
                 newArray = data.Books
            }
            
            const data_books = JSON.stringify(newArray)
            setbook(data_books)  
        })
        .catch(err=>{
            console.log(err)
        })
      }, []);
    
        return(
            
            <div className="book-container"> 
                { !books ? <h4>Please Wait for a while... No books are available...</h4>  : JSON.parse(books).map((book, index)=>{ return( <BookView book={book} key={book.id} user={user} token={token}/> ) })}
            </div>
        )
}
export default Recent