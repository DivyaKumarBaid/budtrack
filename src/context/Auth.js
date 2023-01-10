import React, { useContext, createContext, useState, useEffect } from "react";

const Login = createContext();

export const AuthLogin = () => useContext(Login);

export const Auth = ({ children }) => {

    const [loggedIn, setLogged] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [openCreate, setCreate] = React.useState(false);

    const setLoggedIn = (flag) => {
        !flag && setUser({})
        !flag && localStorage.clear();
        loggedIn !== flag && setLogged(flag);
    }

    const [user, setUser] = useState({
        email: localStorage.getItem('email') ? JSON.parse(localStorage.getItem('email')) : '',
        user_id: localStorage.getItem('user_id') ? JSON.parse(localStorage.getItem('user_id')) : '',
        access_token: localStorage.getItem('access_token') ? JSON.parse(localStorage.getItem('access_token')) : '',
        refresh_token: localStorage.getItem('refresh_token') ? JSON.parse(localStorage.getItem('refresh_token')) : '',
    })

    const fetch_access = () => {
        if (user.access_token === '' || user.refresh_token === '') {
            loggedIn && setLoggedIn(false);
            setAuthLoading(false);
            return
        }
        setAuthLoading(true)
        const url = process.env.REACT_APP_BASE_URL + '/users/user_verification';
        let msg_body = {
            method: 'POST',
            headers: {
                'content-type': "application/json",
            },
            body: JSON.stringify({ refresh_token: user.refresh_token })
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
                    return { ...prev, access_token: data.access_token }
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
        setInterval(() => {
            console.log("refreshing access_token")
            fetch_access();
        }, (1000 * 20 * 60));

        // return () => clearInterval(regen_access_token);
    }, []);

    return (
        <Login.Provider value={{ loggedIn, setLoggedIn, authLoading, user, setUser, openCreate, setCreate }}>
            {children}
        </Login.Provider>
    )
}