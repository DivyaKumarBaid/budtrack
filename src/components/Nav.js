import React from 'react'
import { Link } from 'react-router-dom';
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai'
import { ImHome } from 'react-icons/im'
import { GrAddCircle } from 'react-icons/gr'
import { BiLogIn, BiLogOut } from 'react-icons/bi'
import { AuthLogin } from '../context/Auth';


export function Nav(props) {

    const { loggedIn, setLoggedIn, authLoading, user, setUser, openCreate, setCreate } = AuthLogin();

    return (
        <div className='navContainer' >
            <div className="navLinks">
                <a href='https://www.linkedin.com/in/divya-kumar-baid-98a087200/'>
                    <AiFillLinkedin className="navLogos" />
                </a>
                <a href='https://github.com/DivyaKumarBaid'>
                    <AiFillGithub className="navLogos" />
                </a>
            </div>
            <div className="navBasics">
                <a href='/'><ImHome className="navLogos" /></a>
                {loggedIn && <GrAddCircle className="navLogos" onClick={() => setCreate(true)} />}
            </div>
            <div className="navBasics">
                {loggedIn ? <BiLogOut onClick={() => setLoggedIn(false)} className="navLogos" /> : <a href='/login'><BiLogIn className="navLogos" /></a>}
            </div>
        </div>
    )
}