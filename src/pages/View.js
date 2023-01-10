import { CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react'
import { AuthLogin } from '../context/Auth';

export const View = () => {
    const { loggedIn, setLoggedIn, authLoading, user, setUser } = AuthLogin();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = React.useState(true)
    const [userDetails, setDetails] = React.useState({})

    const fetch_details = () => {
        let cred = {
            "email": JSON.parse(user.email)
        }
        let msg_body = {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + JSON.parse(user.access_token),
                'content-type': "application/json"
            },
            body: JSON.stringify(cred)
        }

        let url = process.env.REACT_APP_BASE_URL + '/get_user_details'

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

    React.useEffect(() => {
        fetch_details();
    }, [])

    return (
        loading ? <div className="w-[100%] h-[100vh] flex justify-center items-center"><CircularProgress /></div> : <div>View</div>
    )
}
