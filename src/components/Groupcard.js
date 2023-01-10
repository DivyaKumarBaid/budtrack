import React from 'react'
import { MdOutlinePeople } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { FaUserPlus, FaUserMinus } from 'react-icons/fa'
import { useSnackbar } from 'notistack'
import { AuthLogin } from '../context/Auth'
import { CircularProgress } from '@mui/material'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { BsDashCircleDotted, BsPlusCircleDotted } from 'react-icons/bs'
import { RxCross2 } from 'react-icons/rx'

export const Groupcard = ({ item }) => {

    const { loggedIn, setLoggedIn, authLoading, user, setUser, openCreate, setCreate } = AuthLogin();
    const { enqueueSnackbar } = useSnackbar();
    const [delLoading, setDel] = React.useState(false);
    const [cardDetails, setCardDetails] = React.useState(false);

    const [addUser, setAdd] = React.useState(false);
    const [addBtn, setAddBtn] = React.useState(false);
    const [added, setAdded] = React.useState([]);
    const [searchRes, setRes] = React.useState([]) //stores search result
    const [fieldEmail, setFieldEmail] = React.useState('')

    const [oldMem, setMem] = React.useState(item.participants)
    const [rmSelected, setRmSel] = React.useState([]);
    const [rmUser, setRm] = React.useState(false);
    const [rmDelBtn, setRmDel] = React.useState(false);

    const fetch_user = (emailAdd) => {
        if (emailAdd === "")
            return
        let cred = {
            "email": emailAdd
        }
        let msg_body = {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + user.access_token,
                'content-type': "application/json"
            },
            body: JSON.stringify(cred)
        }

        let url = process.env.REACT_APP_BASE_URL + '/users/search'

        fetch(url, msg_body)
            .then(res => {
                if (res.status !== 200 && res.status !== 201 && res.status !== 202) {
                    throw Error('UnAuthorised')
                }
                return res.json()
            })
            .then(data => {
                setRes(data)
            })
            .catch(e => {
                enqueueSnackbar(e, { variant: 'error' })
            })
    }

    const add_users = () => {
        setAddBtn(true)
        let cred = {
            group_id: item.group_id,
            email: added.map((it) => it.email)
        }
        let msg_body = {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + user.access_token,
                'content-type': "application/json"
            },
            body: JSON.stringify(cred)
        }

        let url = process.env.REACT_APP_BASE_URL + `/group/add`

        fetch(url, msg_body)
            .then(res => {
                if (res.status !== 200 && res.status !== 201 && res.status !== 202) {
                    throw Error('UnAuthorised')
                }
                enqueueSnackbar("Deleted", { variant: 'success' })
                window.location.reload();
                setAddBtn(false);
            })
            .catch(e => {
                setAddBtn(false)
                enqueueSnackbar(e, { variant: 'error' })
            })
    }

    const delete_users = () => {
        setRmDel(true)
        let cred = {
            group_id: item.group_id,
            email: rmSelected.map((it) => it.email)
        }
        let msg_body = {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + user.access_token,
                'content-type': "application/json"
            },
            body: JSON.stringify(cred)
        }

        let url = process.env.REACT_APP_BASE_URL + `/group/remove`

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
                setRmDel(false)
                enqueueSnackbar(e, { variant: 'error' })
            })
    }

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
        <>
            {/* delete group */}
            <Dialog open={cardDetails} onClose={() => setCardDetails(false)} fullWidth>
                <DialogTitle>{item.subject}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <div className="flex justify-between w-[100%] my-[15px] ">
                            <span>By : {item.admin.email}</span>
                            <span>On: {item.created_on}</span>
                        </div>

                    </DialogContentText>
                    <hr />
                    <DialogContentText>
                        <div className='my-[15px]'>Members : </div>
                    </DialogContentText>
                    <DialogContentText>
                        <div className="profile-container" style={{ boxShadow: 'none' }}>
                            {item.participants.map((par, idx) => {
                                return (
                                    <div className="profile-wrapper">
                                        <span>{par.email}</span>
                                        <span>₹{numberWithCommas(par.amount)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCardDetails(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            {/* remove user */}
            <Dialog open={rmUser} onClose={() => {
                setRm(false)
                setRmSel([])
                setMem(item.participants)
            }} fullWidth>
                <DialogTitle>Remove a member</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <div className='my-[15px]'>Members : </div>
                    </DialogContentText>
                    <DialogContentText>
                        <div className="profile-container" style={{ boxShadow: 'none' }}>
                            {oldMem.map((par, idx) => {
                                return (
                                    <div className="profile-wrapper"
                                        onClick={() => {
                                            setRmSel((prev) => {
                                                return [...prev, { ...par }]
                                            })
                                            setMem((res) => res.filter((x, y) => y !== idx))
                                        }}
                                    >
                                        <span>{par.email}</span>
                                        <span><BsDashCircleDotted /></span>
                                    </div>
                                )
                            })}
                        </div>
                    </DialogContentText>
                    <DialogContentText>
                        <div className='mt-[15px]'> Removed : </div>
                        <div className="profile-container" style={{ boxShadow: 'none' }}>
                            {rmSelected.map((par, idx) => {
                                return (
                                    <div className="profile-wrapper"
                                        onClick={() => {
                                            setMem((prev) => {
                                                return [...prev, { ...par }]
                                            })
                                            setRmSel((res) => res.filter((x, y) => y !== idx))
                                        }}
                                    >
                                        <span>{par.email}</span>
                                        <span><BsDashCircleDotted /></span>
                                    </div>
                                )
                            })}
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setRm(false)
                        setRmSel([])
                        setMem(item.participants)
                    }}>Close</Button>
                    {rmSelected.length > 0 && (rmDelBtn ? <CircularProgress style={{ width: '15px', height: '15px' }} color="inherit" /> : <Button onClick={() => {
                        delete_users()
                        setRm(false)
                        setRmSel([])
                        setMem(item.participants)
                    }}>Remove</Button>)}
                </DialogActions>
            </Dialog>
            {/* add user */}
            <Dialog open={addUser} onClose={() => {
                setAdded([])
                setRes([])
                setMem(item.participants)
                setAdd(false)
            }} fullWidth>
                <DialogTitle>Add a member</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={(event) => {
                            fetch_user(event.target.value)
                            setFieldEmail(event.target.value)
                        }}
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />

                    <DialogContentText>
                        Write a name or the associated email address to add people.
                    </DialogContentText>

                    <DialogContentText>
                        <div className="profile-container">
                            {searchRes.map((par, idx) => {
                                const isAdded = added.filter((ele) => ele.email === par.email).length
                                if (isAdded === 0) {
                                    return (
                                        <div className="profile-wrapper"
                                            onClick={() => {
                                                setAdded((prev) => {
                                                    return [...prev, { ...par }]
                                                })
                                                setRes((res) => res.filter((x, y) => y !== idx))
                                            }}
                                        >
                                            <span>{par.email}</span>
                                            <BsPlusCircleDotted />
                                        </div>
                                    )
                                }
                                else
                                    return <></>
                            })}
                        </div>
                        {fieldEmail !== '' &&
                            <div className="profile-wrapper"
                                onClick={() => {
                                    setAdded((prev) => {
                                        return [...prev, {
                                            email: `${fieldEmail}@budtracker.com`,
                                            user_id: fieldEmail
                                        }]
                                    })
                                }}
                            >
                                <span>{fieldEmail}</span>
                                <BsPlusCircleDotted />
                            </div>
                        }
                    </DialogContentText>

                    <DialogContentText>
                        Added:
                        <div className="profile-container"></div>
                        {added.map((par, idx) => {
                            return (
                                <div className="profile-wrapper"
                                    onClick={() => {
                                        setAdded((res) => res.filter((x, y) => y !== idx))
                                    }}
                                >
                                    <span>{par.email}</span>
                                    <RxCross2 />
                                </div>
                            )
                        })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setAdded([])
                        setRes([])
                        setMem(item.participants)
                        setAdd(false)
                    }}>Close</Button>
                    {added.length > 0 && (addBtn ? <CircularProgress style={{ width: '15px', height: '15px' }} color="inherit" /> : <Button onClick={() => {
                        add_users()
                        setRm(false)
                        setRmSel([])
                        setMem(item.participants)
                    }}>Add</Button>)}
                </DialogActions>
            </Dialog>

            <div className='group-card'>
                <div className="group-info">
                    <div className="group-info-left" onClick={() => setCardDetails(true)}>
                        <div className="group-amount" >
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
                        <span className='cursor-pointer' onClick={() => setAdd(true)}>
                            <FaUserPlus />
                        </span>
                        <span className='cursor-pointer' onClick={() => setRm(true)}>
                            <FaUserMinus />
                        </span>
                    </div>
                </div>
                <div className="group-participants" onClick={() => setCardDetails(true)}>
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
        </>
    )
}
