import { CircularProgress } from '@mui/material';
import React from 'react'
import { AuthLogin } from '../context/Auth';
import { Hero } from './Hero';
import { View } from './View';

export const Home = () => {
    const { loggedIn, setLoggedIn, authLoading, user, setUser, openCreate, setCreate } = AuthLogin();

    return (
        authLoading ? <div className="w-[100%] h-[100vh] flex justify-center items-center"><CircularProgress /></div> :
            loggedIn ?
                <View /> :
                <Hero />
    )
}
