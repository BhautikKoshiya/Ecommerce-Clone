import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth'
import { Outlet } from "react-router-dom"
import axios from 'axios'
import Spinner from '../Spinner'
import { BASE_URL } from '../../Helpers/helper'

const PrivateRoute = () => {

    const [ok, setOk] = useState(false)
    const [auth, setAuth] = useAuth()

    useEffect(() => {
        const authCheck = async () => {
            // const res = await axios.get(`${BASE_URL}/api/v1/auth/user-auth`, {
            //     headers: {
            //         Authorization: `Bearer ${auth?.token}`
            //     }
            // })
            const role = localStorage.getItem("authData");
                const jsonObject = JSON.parse(role);

            if (jsonObject.user.role === 0) {
                setOk(true)
            } else {
                setOk(false)
            }
        }

        if (auth?.token) {
            authCheck()
        }

    }, [auth?.token])

    return ok ? <Outlet /> : <Spinner />
}

export default PrivateRoute
