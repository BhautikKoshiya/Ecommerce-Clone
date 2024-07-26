import React, { useEffect, useState } from 'react'
import AdminMenu from '../components/Layout/AdminMenu'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auth'
import axios from 'axios'
import moment from "moment"
import { Select } from 'antd';
import { Option } from 'antd/es/mentions'
import {BASE_URL} from "../Helpers/helper"


const AdminOrders = () => {
    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Cancel"])
    const [orders, setOrders] = useState([])
    const [auth, setAuth] = useAuth()

    //getAllOrders
    const getAllOrders = async () => {
        try {
            const res  = await axios.get(`${BASE_URL}/fetchAllOrders`)
            if (res.data.body.success) {
                setOrders(res.data?.body.orders)
            }
        } catch (error) {
            console.log(error);
        }
    }
    // handleOrderStatus
    // const handleOrderStatus = async (orderId, value) => {
    //     try {
    //         await axios.put(`${BASE_URL}/api/v1/auth/order-status/${orderId}`, { status: value }, {
    //             headers: {
    //                 Authorization: `Bearer ${auth?.token}`
    //             }
    //         })
    //         getAllOrders()
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

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
                        <AdminMenu />
                    </div>
                    <div className="col-md-7">
                        <h4 className="text-center mb-4">ALL ORDERS</h4>
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
                                                    {/* <td>
                                                        <Select
                                                            bordered={false}
                                                            defaultValue={o?.status}
                                                            style={{ width: 120 }}
                                                            // onChange={(value) => handleOrderStatus(o._id, value)}
                                                        >
                                                            {
                                                                status?.map((s, i) => {
                                                                    return <Option key={i} value={s}>
                                                                        {s}
                                                                    </Option>
                                                                })
                                                            }
                                                        </Select>
                                                    </td> */}
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
                                                        <div className="row mb-2 p-3 card flex-row" key={p.id}>
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

export default AdminOrders
