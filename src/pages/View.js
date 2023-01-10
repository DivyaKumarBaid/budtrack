import { CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react'
import { Groupcard } from '../components/Groupcard';
import { AuthLogin } from '../context/Auth';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { BsPlusCircleDotted } from 'react-icons/bs'
import { RxCross2 } from 'react-icons/rx'

export const View = () => {
    const { loggedIn, setLoggedIn, authLoading, user, setUser, openCreate, setCreate } = AuthLogin();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = React.useState(true)
    const [userDetails, setDetails] = React.useState({})
    const [subload, setSubLoad] = React.useState(false);

    const [groupInfo, setInfo] = React.useState({
        amount: 0,
        admin: {
            user_id: user.user_id,
            email: user.email,
            amount: 0
        },
        participants: [{}],
        subject: ""
    })

    const [participants, setPart] = React.useState([
        {
            user_id: "",
            email: "",
            amount: 0
        }
    ]) //final participants list

    const [searchRes, setRes] = React.useState([]) //stores search result
    const [added, setAdded] = React.useState([]) //add participants
    const [fieldEmail, setFieldEmail] = React.useState("")

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

    const fetch_details = () => {

        let cred = {
            "email": user.email
        }
        let msg_body = {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + user.access_token,
                'content-type': "application/json"
            },
            body: JSON.stringify(cred)
        }

        let url = process.env.REACT_APP_BASE_URL + '/users/get_user_details'

        fetch(url, msg_body)
            .then(res => {
                if (res.status !== 200 && res.status !== 201 && res.status !== 202) {
                    throw Error('UnAuthorised')
                }
                return res.json()
            })
            .then(data => {
                setDetails(data)
                setLoading(false);
            })
            .catch(e => {
                enqueueSnackbar(e, { variant: 'error' })
                setLoggedIn(false);
            })
    }

    const create_group_submit = () => {
        if (groupInfo.amount === 0) {
            enqueueSnackbar('Amount needs to be more than 0', { variant: 'error' })
            return false
        }
        if (groupInfo.subject == "") {
            enqueueSnackbar('Subject is Missing', { variant: 'error' })
            return false
        }
        setSubLoad(true);

        const new_arr = added.map(item => {
            return { ...item, amount: (groupInfo.amount / added.length) }
        })

        const cred = { ...groupInfo, participants: new_arr, admin: { ...groupInfo.admin, amount: groupInfo.amount } }

        let msg_body = {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + user.access_token,
                'content-type': "application/json"
            },
            body: JSON.stringify(cred)
        }

        let url = process.env.REACT_APP_BASE_URL + '/group/create'

        fetch(url, msg_body)
            .then(res => {
                setSubLoad(false);
                if (res.status !== 200 && res.status !== 201 && res.status !== 202) {
                    throw Error('UnAuthorised')
                }
                return res.json()
            })
            .then(data => {
                enqueueSnackbar('Successfully created !', { variant: 'error' })
                window.location.reload()
            })
            .catch(e => {
                enqueueSnackbar(e, { variant: 'error' })
            })
    }

    const closeDialogue = () => {
        setFieldEmail('')
        setCreate(false)
        setPart([])
        setRes([])
        setAdded([])
    }

    React.useEffect(() => {
        fetch_details();
    }, [])

    return (
        loading ?
            <div className="w-[100%] h-[100vh] flex justify-center items-center">
                <CircularProgress />
            </div> : <>
                <Dialog open={openCreate} onClose={() => closeDialogue()}>
                    <DialogTitle>Split an expense</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Create a group for spliting expense.
                        </DialogContentText>
                        <TextField
                            startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                            value={groupInfo.amount === 0 ? '' : groupInfo.amount}
                            onChange={(event) => {
                                setInfo((prev) => {
                                    return { ...prev, amount: event.target.value }
                                })
                            }}
                            autoFocus
                            margin="dense"
                            id="amount"
                            label="Amount"
                            type="number"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            value={groupInfo.subject}
                            onChange={(event) => {
                                setInfo((prev) => {
                                    return { ...prev, subject: event.target.value }
                                })
                            }}
                            autoFocus
                            margin="dense"
                            id="subject"
                            label="subject"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            value={groupInfo.email}
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
                        <Button onClick={() => closeDialogue()}>Cancel</Button>
                        {subload ? <CircularProgress style={{ width: '15px', height: '15px' }} color="inherit" /> : <Button onClick={() => {
                            create_group_submit() && closeDialogue()
                        }}>Create</Button>}
                    </DialogActions>
                </Dialog>
                <div>
                    <div className="home-container">
                        <div className="home-heading">
                            Groups
                        </div>
                        {/* <hr /> */}
                        {userDetails.created_groups.length > 0 && <div className="created-container">
                            <div className="created-head">
                                Crafted
                            </div>
                            <div className="created-group-wrapper">
                                {
                                    userDetails.created_groups.map((item, idx) => {
                                        return (
                                            <Groupcard item={item} key={'c' + idx} />
                                        )
                                    })
                                }
                            </div>
                        </div>}
                        {userDetails.invited_groups.length > 0 &&
                            <div className="created-container invited-container">
                                <div className="created-head">
                                    Invited
                                </div>
                                <div className="created-group-wrapper">
                                    {
                                        userDetails.invited_groups.map((item, idx) => {
                                            return (
                                                <Groupcard item={item} key={'i' + idx} />
                                            )
                                        })
                                    }
                                </div>
                            </div>}
                    </div>
                </div>
            </>
    )
}
