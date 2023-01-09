import { CircularProgress } from '@mui/material';
import React from 'react'
import { AuthLogin } from '../context/Auth';
import { Hero } from './Hero';

export const Home = () => {
    const { loggedIn, setLoggedIn, authLoading, user, setUser } = AuthLogin();

    return (
        authLoading ? <div className="w-[100%] h-[100vh] justify-center items-center"><CircularProgress /></div> :
            loggedIn ?
                <div> Home</div > :
                <Hero />
    )
}
