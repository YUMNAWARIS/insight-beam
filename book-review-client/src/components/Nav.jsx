import './Nav.css'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/auth'

function Nav(props) {
    const {token, user}= props
    const {  logout } = useAuth()
    if (token) {
        return (
            <div className="Nav">
                <nav className="navbar">
                    <h1 className="navbar-logo">GoodReads</h1>
                    <ul>
                        <div className='showed'>
                            <li><Link to='/profile'>{user.user_name?user.user_name:"Profile"}</Link></li>
                            <li onClick={logout} className='logout'>Logout</li>
                        </div>
                        <li>
                            <div className="dropdown">
                                <div className="dropbtn"><i className='fa fa-bars nav-bar-icon'></i></div>
                                <div className="dropdown-content">
                                    <Link to='/'>Home</Link>
                                    <Link to='/recent'>Recent</Link>
                                    <Link to='/about'>About Us</Link>
                                    <Link to='/contact'>Contact</Link>
                                    <hr />
                                    <div className='hidden'>
                                        <p onClick={logout} className='logout'>Logout</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
    return (
        <div className="Nav">
            <nav className="navbar">
                <h1 className="navbar-logo">GoodReads</h1>
                <ul>
                    <div className='showed'>
                        <li><Link to='/login' >Login</Link></li>
                        <li><Link to='/signup'>Sign Up</Link></li>
                    </div>
                    <li>
                        <div className="dropdown">
                            <div className="dropbtn"><i className='fa fa-bars nav-bar-icon'></i></div>
                            <div className="dropdown-content">
                                <Link to='/'>Home</Link>
                                <Link to='/recent'>Recent</Link>
                                <Link to='/about'>About Us</Link>
                                <Link to='/contact'>Contact</Link>
                                <hr />
                                <div className='hidden'>
                                    <Link to='/login' >Login</Link>
                                    <Link to='/dignup'>Sign Up</Link>
                                </div>


                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Nav