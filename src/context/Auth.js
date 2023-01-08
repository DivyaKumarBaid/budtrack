import React, { useContext, createContext, useState, useEffect } from "react";

const Login = createContext();

export const AuthLogin = () => useContext(Login);

export const Auth = ({ children }) => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const [user, setUser] = useState({
        email: localStorage.getItem('email') || '',
        user_id: localStorage.getItem('user_id') || '',
        access_token: localStorage.getItem('access_token') || '',
        refresh_token: localStorage.getItem('refresh_token') || '',
    })

    const fetch_access = () => {
        const url = process.env.REACT_APP_BASE_URL + '/users/user_verification';
        let msg_body = {
            method: 'POST',
            headers: {
                'content-type': "application/json",
            },
            body: JSON.stringify({ refresh_token: JSON.parse(user.refresh_token) })
        }
        fetch(url, msg_body)
            .then(res => {
                if (res.status !== 200 && res.status !== 201 && res.status !== 202) {
                    setUser({})
                    localStorage.clear();
                    throw Error('UnAuthorised')
                }
                return res.json()
            })
            .then(data => {
                localStorage.setItem('access_token', JSON.stringify(data));
                setUser(prev => {
                    return { ...prev, access_token: data }
                })
            })
            .catch(e => {
                setUser({})
                localStorage.clear();
                (window.location.pathname !== '/login' && window.location.pathname !== '/signup') && window.location.replace(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + '/login')
            })
    }
    useEffect(() => {
        if (user.access_token === '' || user.refresh_token === '') {
            // console.log("idk what went wrong")
            (window.location.pathname !== '/login' && window.location.pathname !== '/signup') && window.location.replace(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + '/login')
        }
        else {
            fetch_access();
        }
    }, [])

    useEffect(() => {
        const regen_access_token = setInterval(() => {
            fetch_access();
        }, (1000 * 20 * 60));

        return () => clearInterval(regen_access_token);
    }, []);

    return (
        <Login.Provider value={{ loggedIn, setLoggedIn, authLoading, user, setUser }}>
            {children}
        </Login.Provider>
    )
}