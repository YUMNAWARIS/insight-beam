import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function AuthUser() {
    const navigate = useNavigate();

    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken

    }

    const getUser = () => {
        const userString = sessionStorage.getItem('user');
        const user_detail = JSON.parse(userString);
        return user_detail

    }

    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());

    const saveToken = (token) => {
        sessionStorage.setItem('token', JSON.stringify(token));
        setToken(token);
    }
    const saveUser = (user) => {
        sessionStorage.setItem('user', user);
        setUser(user);
        // navigate('/');
    }
    const logout = () => {
        sessionStorage.clear();
        navigate('/login');
    }

    

    return {
        saveToken,
        saveUser,
        token,
        user,
        getToken,
        getUser,
        logout,

    }
}