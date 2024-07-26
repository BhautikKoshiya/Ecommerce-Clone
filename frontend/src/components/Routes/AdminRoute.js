import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth';
import { Outlet } from "react-router-dom";
import Spinner from '../Spinner';
import { BASE_URL } from '../../Helpers/helper';

const AdminRoute = () => {
    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authCheck = async () => {
            try {
                // const response = await fetch(`${BASE_URL}/api/v1/auth/admin-auth`, {
                //     method: 'GET',
                //     headers: {
                //         Authorization: `Bearer ${auth?.token}`
                //     }
                // });
                const role = localStorage.getItem("authData");
                const jsonObject = JSON.parse(role);

                // console.log("user role check", jsonObject.user.role);

                if (jsonObject.user.role === 1) {
                    // const data = await response.json();
                    if (jsonObject.user.role === 1) {
                        setOk(true);
                    } else {
                        setOk(false);
                    }
                } else {
                    setOk(false);
                }
            } catch (error) {
                console.error("Error checking admin authentication:", error);
                setOk(false);
            } finally {
                setLoading(false);
            }
        };

        if (auth?.token) {
            authCheck();
        }
    }, [auth?.token]);

    return loading ? <Spinner /> : ok ? <Outlet /> : <div>Access Denied</div>;
};

export default AdminRoute;
