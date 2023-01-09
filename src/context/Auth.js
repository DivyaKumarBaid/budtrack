import React, { useContext, createContext, useState, useEffect } from "react";

const Login = createContext();

export const AuthLogin = () => useContext(Login);

export const Auth = ({ children }) => {

    const [loggedIn, setLogged] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const setLoggedIn = (flag) => {
        !flag && setUser({})
        !flag && localStorage.clear();
        loggedIn !== flag && setLogged(flag);
    }

    const [user, setUser] = useState({
        email: localStorage.getItem('email') || '',
        user_id: localStorage.getItem('user_id') || '',
        access_token: localStorage.getItem('access_token') || '',
        refresh_token: localStorage.getItem('refresh_token') || '',
    })

    const fetch_access = () => {
        setAuthLoading(true)
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
                !loggedIn && setLoggedIn(true);
                localStorage.setItem('access_token', JSON.stringify(data));
                setUser(prev => {
                    return { ...prev, access_token: data }
                })
                setAuthLoading(false);
            })
            .catch(e => {
                setUser({})
                localStorage.clear();
                loggedIn && setLoggedIn(false);
                setAuthLoading(false);
            })
    }
    useEffect(() => {
        if (user.access_token === '' || user.refresh_token === '') {
            loggedIn && setLoggedIn(false);
            setAuthLoading(false);
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