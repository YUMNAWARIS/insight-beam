import {Routes,Route} from 'react-router-dom'
import { useState } from 'react'
import Home from '../common/Home'
import Login from '../nonuser/Login'
import Signup from '../nonuser/Register'
import About from '../common/About'
import Contact from '../common/Contact'
import Recent from '../common/Recent'
import Profile from '../user/Profile'
import Upload from '../user/Profile/UploadBook'
import MyBooks from '../user/Profile/MyBooks'
import Liked from '../user/Profile/Likes'
function Section(props) {
    const {token,user} = props

    if(token){
        return (
            <Routes>
                <Route path='' element={<Home user={user} token={token}></Home>}></Route>
                <Route path='/profile' element={<Profile user={user}></Profile>}>
                    <Route path='' index element={<MyBooks user={user} token={token} ></MyBooks>}></Route>
                    <Route path='books'  element={<MyBooks user={user} token={token}></MyBooks>}></Route>
                    <Route path='upload' element={<Upload></Upload>}></Route>
                    <Route path='likes' element={<Liked user={user} token={token}></Liked>}></Route>
                </Route>
                <Route path='/about' element={<About></About>}></Route>
                <Route path='/contact' element={<Contact></Contact>}></Route>
                <Route path='/recent' element={<Recent></Recent>}></Route>
                <Route path='*' element={<Home user={user} token={token}></Home>}></Route>

            </Routes>
        )
    }
    else{
        return (
            <Routes>
                <Route path='/login' element={<Login></Login>}></Route>
                <Route path='/signup' element={<Signup></Signup>}></Route>
                <Route path='' element={<Home user='guest' token={null}></Home>}></Route>
                <Route path='/about' element={<About></About>}></Route>
                <Route path='/contact' element={<Contact></Contact>}></Route>
                <Route path='/recent' element={<Recent></Recent>}></Route>
                <Route path='*' element={<Home></Home>}></Route>
            </Routes>
        )
    }   
}

export default Section