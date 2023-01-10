import React from 'react';
import useForm from '../utils/useForm';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { AuthLogin } from '../context/Auth';

export const Login = () => {
    const [subLoad, setLoad] = React.useState(false);
    const [showPass, setShow] = React.useState(false);
    const [value, handleChange] = useForm({ email: '', password: '' });
    const { enqueueSnackbar } = useSnackbar();
    const { loggedIn, setLoggedIn, authLoading, user, setUser, openCreate, setCreate } = AuthLogin();

    const handleSubmit = () => {
        if (subLoad)
            return
        setLoad(true);
        const url = process.env.REACT_APP_BASE_URL + '/Login';
        let msg_body = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(`grant_type=&username=${value.email}&password=${value.password}&scope=&client_id=&client_secret=`)
        }
        fetch(url, msg_body)
            .then(res => {
                setLoad(false);
                if (res.status !== 200 && res.status !== 201 && res.status !== 202)
                    throw Error("Something went wrong!")
                setLoad(false);
                enqueueSnackbar('Login Successfull', { variant: 'success' })
                return res.json()
            })
            .then(data => {
                localStorage.setItem('access_token', JSON.stringify(data.access_token));
                localStorage.setItem('refresh_token', JSON.stringify(data.refresh_token));
                localStorage.setItem('email', JSON.stringify(data.email));
                localStorage.setItem('user_id', JSON.stringify(data.user_id));
                setUser(data);
                window.location.replace(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + '/')
            })
            .catch(err => {
                setLoad(false);
                console.log(err)
                enqueueSnackbar(err, { variant: 'error' })
                return
            })
    }

    return (
        <div className="login-container" >
            <div className="login-card">
                <div className="login-instructions">
                    <img src="./assets/company.png" className="login-image" alt="" />
                    <div className="login-welcome">
                        Welcome Back!
                    </div>
                    <div className="login-indications">
                        Sign-In to your account
                    </div>
                </div>

                <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={value.email}
                    onChange={handleChange}
                />
                <div className="password-eye">
                    <input
                        placeholder="Password"
                        type={showPass ? 'text' : 'password'}
                        name="password"
                        value={value.password}
                        onChange={handleChange}
                    />
                    {showPass ? <AiFillEyeInvisible className='cursor-pointer opacity-[0.8]' onClick={() => setShow(prev => !prev)} /> : <AiFillEye className='cursor-pointer opacity-[0.8]' onClick={() => setShow(prev => !prev)} />}
                </div>

                <div className="submit-btn" onClick={() => handleSubmit()}>
                    {!subLoad ? <span className="cursor-pointer" >Login</span> : <CircularProgress style={{ width: '25px', height: '25px' }} color="inherit" />}
                </div>

                <div className="no-acc">
                    Don't have an account ? <a className="login-link" href="/signup">Signup Here !</a>
                </div>

            </div>
        </div>
    )
}
