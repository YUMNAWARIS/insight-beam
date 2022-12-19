import './About.css'
import aboutus from '../assets/aboutus1.jpg'
import bookscollection from '../assets/bookcollection.webp'

function About() {
    return (
        <div className="about">
            <div className="intro">
                <div>
                    <img src={aboutus} />
                </div>
                <div>
                    <h2 >Who We Are</h2>
                    <p>GoodReads is here to help you in your search for a book that is worth it. We know what it feels like when
                        you judge a book by its cover and it looks good but you do not know what is inside. You do not want to spend
                        your hard-earned money on something that looked like gold from far but it is just cheap glitter up close.
                    </p>
                </div>
            </div>

            <div className="intro">

                <div className='about-books'>
                    <img src={bookscollection} />
                </div>
                <div>
                    <p>GoodReads has a collection of books uploaded by other book connoisseurs that are reviewed and rated by other book connoisseurs. It is THAT simple.</p><br />
                    <p>GoodReads is a community of book readers where everyone helps each other out in choosing the right book that
                        you can enjoy while sipping hot chocolate by the fire.</p>
                </div>
            </div>

            <div className="perks">
                <h2>Perks For Registered Users</h2><br />
                <p>If you are here to browse books or, want to get reviews on some books then you are more then welcome.</p><br />
                <p>But, if you become a registered user then you will be able to upload a book of your own choice. Moreover, you
                    will also get to give an upvote to a book that you liked. Isnt it exciting!? Perks dont end here, you will
                    also be able to give your reviews on the book too!</p>
                
                                    
            </div>

        </div>
    )
}
export default About