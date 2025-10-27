import {Link } from 'react-router-dom'
import './Footer.css'

function Footer(props) {
    const { user, token } = props

    return (
        <div className='Footer'>
            <div className='footer-head'>
                <h1>Insight Beam</h1>
                <h6>A wonderful platform where you can find and share your thoughts about your favourite books...</h6>
            </div>
            <div className='footer-body'>
                <ul>

                    <h3>Explore Our Site</h3>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/recent'>Recent</Link>
                    </li>
                    <li>
                        <Link to='/about'>About Us</Link>
                    </li>
                    <li>
                        <Link to='/contact'>Contact</Link>
                    </li>
                </ul>
                <ul>
                    <div>
                        <h3>Join Us Now On Social Media Platforms Now.</h3>
                        <li><i className='fab fa-facebook'></i><a href=""> Facebook</a></li>
                        <li><i className='fab fa-instagram'></i><a href=""> Instagram</a></li>
                        <li><i className='fab fa-twitter'></i><a href=""> Twitter</a></li>
                        <li><i className='fab fa-linkedin-in'></i><a href=""> Linkedin</a></li>
                    </div>

                </ul>
                <ul>
                    <div>
                        <h3>Our Inspirations</h3>
                        <li><i className='fab fa-google'></i><a href=""> Google</a></li>
                        <li><i className='fab fa-amazon'></i><a href=""> Amazon</a></li>
                    </div>
                </ul>

            </div>
            <div className='footer-end'>
                <div className='copywrite'>
                    <p>© Insight Beam Inc 2022</p>
                </div>
            </div>

        </div>
    )


}

export default Footer