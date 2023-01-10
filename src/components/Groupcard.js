import React from 'react'
import { MdOutlinePeople } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { FaUserPlus, FaUserMinus } from 'react-icons/fa'
import { useSnackbar } from 'notistack'
import { AuthLogin } from '../context/Auth'
import { CircularProgress } from '@mui/material'

const example_obj = {
    "user": "string",
    "email": "divyakumarbaid.dkb.2001@gmail.com",
    // "password": "$2b$12$GErkjRUu3avALrV/ff/NoehE.whDa3FP74b1KERuyIbWob2ZPq/eC",
    "user_id": "28c23a1e-c42b-47da-b2ce-a1b64472d63b",
    "created_groups": [
        {
            "subject": "string",
            "amount": 0,
            "created_on": "2023-01-08",
            "group_id": "0ff5750a-829a-4d89-a40b-3ad92f8bdbea",
            "admin": {
                "user_id": "28c23a1e-c42b-47da-b2ce-a1b64472d63b",
                "email": "divyakumarbaid.dkb.2001@gmail.com",
                "amount": 100
            },
            "participants": [
                {
                    "user_id": "a118f80c-0c6f-4f24-b87f-504694383312",
                    "email": "tewamo1215@cmeinbox.com",
                    "amount": 0
                }
            ]
        }
    ],
    "invited_groups": [],
    "requests": [],
    "notifications": []
}


export const Groupcard = ({ item }) => {

    const { loggedIn, setLoggedIn, authLoading, user, setUser, openCreate, setCreate } = AuthLogin();
    const { enqueueSnackbar } = useSnackbar();
    const [delLoading, setDel] = React.useState(false);

    const delete_group = () => {
        setDel(true)
        let msg_body = {
            method: 'DELETE',
            headers: {
                'Authorization': "Bearer " + user.access_token,
                'content-type': "application/json"
            }
        }

        let url = process.env.REACT_APP_BASE_URL + `/group/${item.group_id}`

        fetch(url, msg_body)
            .then(res => {
                if (res.status !== 200 && res.status !== 201 && res.status !== 202) {
                    throw Error('UnAuthorised')
                }
                enqueueSnackbar("Deleted", { variant: 'success' })
                window.location.reload();
                setDel(false);
            })
            .catch(e => {
                setDel(false)
                enqueueSnackbar(e, { variant: 'error' })
            })
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div className='group-card'>
            <div className="group-info">
                <div className="group-info-left">
                    <div className="group-amount">
                        <span className='rupees-symbol'>
                            ₹
                        </span>
                        {numberWithCommas(item.amount)}
                    </div>
                    <div className="group-subject">
                        {item.subject}
                    </div>
                </div>
                <div className="group-info-right">
                    {delLoading ?
                        <CircularProgress style={{ width: '15px', height: '15px' }} color="inherit" />
                        :
                        <span className='cursor-pointer' onClick={() => delete_group()}>
                            <AiFillDelete />
                        </span>
                    }
                    <FaUserPlus />
                    <FaUserMinus />
                </div>
            </div>
            <div className="group-participants">
                <div className="group-participant-number">
                    <MdOutlinePeople style={{ fontSize: '1.2rem', marginRight: '5px' }} />{item.participants.length}
                </div>
                <div className="group-created">
                    {item.created_on}
                </div>
            </div>
            {/* <div className="group-instruction">
                Click see details
            </div> */}
        </div>
    )
}
