import dp from '../assets/profile.jpg'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import './Profile.css'
import Upload from './Profile/UploadBook'
import { useReducer } from 'react'
function Profile(props) {
    const user = props.user
    return (
        <div className="profile">
            <div className="profile-head">
                <div className="profile-dp">
                    <img src={dp} alt="DP - Profile..." />
                </div>
                <div className="profile-info">
                    <h3>{user.user_name}</h3>
                    <h6>{user.user_email}</h6>
                    <p>{user.user_bio}</p>
                </div>
            </div>
            {/*---------------------------------------------------------------------------------------*/}
            <div className='profile-nav'>
                <ul>
                    <div className='nav-links'>
                        <li><Link to='books'  >Books</Link></li>
                        <li><Link to='likes'>Likes</Link></li>
                        {/* <li><Link to='reviews'>Reviews</Link></li> */}
                        <li><Link to='upload'>Upload</Link></li>                        
                    </div>
                </ul>
            </div>
            {/*---------------------------------------------------------------------------------------*/}
            <div className='profile-main-body'>
                <Outlet/>
            </div>
        </div>
    )
}

export default Profile