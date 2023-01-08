import React from 'react';
import useForm from '../utils/useForm';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { TiTick } from 'react-icons/ti'
import { BiError } from 'react-icons/bi'
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material';

export const Signup = () => {

    const { enqueueSnackbar } = useSnackbar()

    const [subLoad, setLoad] = React.useState(false);

    const [value, handleChange] = useForm({
        name: '',
        email: '',
        password: '',
        cpassword: ''
    });
    const [showPass, setShow] = React.useState(false);

    const handleSubmit = () => {
        setLoad(true);
        console.log(subLoad)
        if (value.password !== value.cpassword) {
            enqueueSnackbar('Password doesnt match', { variant: 'error' })
            setLoad(false);
            return
        }
        if (value.password.length === 0) {
            enqueueSnackbar('Weak Password ', { variant: 'error' })
            setLoad(false);
            return
        }
        const url = process.env.REACT_APP_BASE_URL + '/users/create';
        let msg_body = {
            method: 'POST',
            headers: {
                'content-type': "application/json",
            },
            body: JSON.stringify({
                user: value.name,
                email: value.email,
                password: value.password
            })
        }

        fetch(url, msg_body)
            .then(res => {
                if (res.status !== 200 && res.status !== 201)
                    throw Error("Something went wrong!")
                else {
                    setLoad(false);
                    enqueueSnackbar('Account created, check your email ', { variant: 'success' })
                    window.location.replace(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + '/login')
                }
            })
            .catch(err => {
                setLoad(false);
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
                        Welcome !
                    </div>
                    <div className="login-indications">
                        Create your account
                    </div>
                </div>

                <input
                    placeholder="Name"
                    type="text"
                    name="name"
                    value={value.name}
                    onChange={handleChange}
                />
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

                <div className="password-eye">
                    <input
                        placeholder="Confirm Your Password"
                        type="password"
                        name="cpassword"
                        value={value.cpassword}
                        onChange={handleChange}
                    />
                    {value.password !== value.cpassword || value.password === '' ? <BiError style={{ color: 'red' }} /> : <TiTick style={{ color: 'green' }} />}
                </div>

                <div onClick={() => handleSubmit()} className="submit-btn">
                    {!subLoad ? <span className="cursor-pointer">Create Account</span> : <CircularProgress style={{ width: '25px', height: '25px' }} color="inherit" />}
                </div>

                <div className="no-acc">
                    Already have an account ? <a className="login-link" href="/login">Login Here !</a>
                </div>

            </div>
        </div>
    )
}
