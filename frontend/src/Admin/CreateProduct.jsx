import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import AdminMenu from '../components/Layout/AdminMenu'
import axios from 'axios'
import { Select,message } from "antd"
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../Helpers/helper'

const CreateProduct = () => {
    const [auth, setAuth] = useAuth();
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [photo, setPhoto] = useState("")
    const [quantity, setQuantity] = useState("")
    const [category, setCategory] = useState("")
    const [shipping, setShipping] = useState("")

    console.log(shipping);
    const { Option } = Select
    const navigate = useNavigate()
    //getAll Categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/getCategory`)
            console.log("2 ", JSON.parse(data.body).categories);

            if (JSON.parse(data.body).success) {
                setCategories(JSON.parse(data.body).categories)
            }

        } catch (error) {
            console.log(error);
            message.error(error)
        }
    }

    useEffect(() => {
        getAllCategory()
        console.log("selected", category)
    }, [])

    //handleCreateProduct
    const handleCreateProduct = async (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
    
        // Check form validity
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
    
        try {
            // Convert image file to base64
            let imageBase64 = "";
            if (photo) {
                const reader = new FileReader();
                reader.readAsDataURL(photo);
                reader.onloadend = async () => {
                    imageBase64 = reader.result;
    
                    // Prepare JSON payload
                    const productData = {
                        name,
                        description,
                        price,
                        category,
                        quantity,
                        image: imageBase64,
                        shipping
                    };
    
                    // Send request
                    const res  = await axios.post(`${BASE_URL}/createProduct`, productData, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });


                    if (res.data.statusCode === 200) {
                        message.success(JSON.parse(res.data.body).message);
                        navigate("/dashboard/admin/products");
                    } else {
                        message.error(res.error || "Something Went Wrong While Creating New Product!!");
                    }
    
                    // Clear form fields
                    setName("");
                    setDescription("");
                    setPrice("");
                    setPhoto("");
                    setCategory("");
                    setQuantity("");
                    setShipping("");
                };
            } else {
                // Handle case where no image is provided
                const productData = {
                    name,
                    description,
                    price,
                    category,
                    quantity,
                    shipping
                };
    
                const res = await axios.post(`${BASE_URL}/createProduct`, productData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });


                if (res.data.statusCode === 200) {
                    message.success(JSON.parse(res.data.body).message);
                    navigate("/dashboard/admin/products");
                } else {
                    message.error(res.error || "Something Went Wrong While Creating New Product!!");
                }
    
                // Clear form fields
                setName("");
                setDescription("");
                setPrice("");
                setPhoto("");
                setCategory("");
                setQuantity("");
                setShipping("");
            }
        } catch (error) {
            console.log(error);
            message.error("Something Went Wrong While Creating New Product!!");
        }
    }

    return (
        <Layout>
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-md-4">
                        <AdminMenu />
                    </div>
                    <div className="col-md-7">
                        <h4 className="mb-4 text-center">CREATE NEW PRODUCT</h4>
                        <form>
                            <div className="m-1 w-70">
                                <Select
                                    bordered={false}
                                    placeholder="Select Category"
                                    size='large'
                                    showSearch
                                    className='form-select mb-3'
                                    onChange={(value) => { setCategory(value)
                                        console.log("selected  ", value);
                                     }}
                                >
                                    {
                                        categories?.map((c) => {
                                            return <Option key={c.id} value={c.name}>{c.name}</Option>
                                        })
                                    }

                                </Select>

                                <div className="mb-3">
                                    <label className='btn btn-outline-success col-md-12'>
                                        {photo ? photo.name : "Upload Product Image"}
                                        <input
                                            type="file"
                                            name='photo'
                                            accept="image/*"
                                            hidden
                                            required
                                            onChange={(e) => { setPhoto(e.target.files[0]) }}
                                        />
                                    </label>
                                </div>
                                <div className="mb-3 text-center">
                                    {photo && (
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt='Product Image'
                                            height={"200px"}
                                            className='img img-responsive'
                                        />
                                    )}
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder='Enter Product Name'
                                        className='form-control'
                                        required
                                        value={name}
                                        onChange={(e) => { setName(e.target.value) }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <textarea
                                        type="text"
                                        placeholder='Enter Product Description'
                                        className='form-control'
                                        required
                                        value={description}
                                        onChange={(e) => { setDescription(e.target.value) }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="number"
                                        placeholder='Enter Product Price'
                                        className='form-control'
                                        required
                                        value={price}
                                        onChange={(e) => { setPrice(e.target.value) }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="number"
                                        placeholder='Enter Product Quantity'
                                        className='form-control'
                                        required
                                        value={quantity}
                                        onChange={(e) => { setQuantity(e.target.value) }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <Select
                                        bordered={false}
                                        placeholder="Enter Product Shipping"
                                        size='large'
                                        showSearch
                                        className='form-control mb-3'
                                        onChange={(value) => { setShipping(value) }}
                                    >
                                        <Option value="0">Yes</Option>
                                        <Option value="1">No</Option>
                                    </Select>
                                </div>

                                <div className="mb-3">
                                    <button type="submit" className='btn btn-primary' onClick={handleCreateProduct}>Create new Product</button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default CreateProduct
