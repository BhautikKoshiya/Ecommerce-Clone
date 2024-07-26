import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import UserMenu from '../components/Layout/UserMenu'
import axios from 'axios'
import { useAuth } from '../context/auth'
import moment from "moment"
import { BASE_URL } from '../Helpers/helper'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [auth, setAuth] = useAuth()

    //getAllOrders
    const getAllOrders = async () => {
        try {
            const authData = localStorage.getItem("authData");
            const userId = JSON.parse(authData).user.email;
            const requestBody = {
                userId: userId
            }
            const res  = await axios.post(`${BASE_URL}/retrieveOrderByUser`, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (res.data.body.success) {
                setOrders(res.data.body.orders)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (auth?.token) {
            getAllOrders()
        }
    }, [auth?.token])

    return (
        <Layout>
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-md-4">
                        <UserMenu />
                    </div>
                    <div className="col-md-7">
                        <h4 className="text-center">All Orders</h4>
                        {
                            orders?.map((o, i) => {
                                return (
                                    <div className="border shadow" key={o.orderId}>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Sr No.</th>
                                                    {/* <th scope="col">Status</th> */}
                                                    <th scope="col">Buyer</th>
                                                    <th scope="col">Orders</th>
                                                    {/* <th scope="col">Payment</th> */}
                                                    <th scope="col">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td scope="row">{i + 1}</td>
                                                    {/* <td>{o?.status}</td> */}
                                                    <td>{o?.userId}</td>
                                                    <td>{moment(o?.crearedAt).fromNow()}</td>
                                                    {/* <td>{o?.payment?.success ? "Success" : "Failed"}</td> */}
                                                    <td>{JSON.parse(o?.products)?.length}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="container">
                                            {
                                                JSON.parse(o?.products)?.map((p) => {
                                                    return (
                                                        <div className="row mb-2 p-3 card flex-row" key={p.orderId}>
                                                            <div className="col-md-4">
                                                                <img
                                                                    src={p.imageUrl}
                                                                    className="card-img-top"
                                                                    alt={p.name}
                                                                />
                                                            </div>

                                                            <div className="col-md-8">
                                                                <p className="card-title">{p.name}</p>
                                                                <p className="card-text">{p.description.substring(0, 40)}...</p>
                                                                <p className="card-text">Price : ${p.price}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }


                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Orders
