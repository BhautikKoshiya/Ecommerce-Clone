import axios from "axios"
import { BASE_URL } from "../Helpers/helper"

const { useState, useEffect } = require("react")

const useCategory = () => {
    const [categories, setCategories] = useState([])

    //getAll categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/getCategory`)
            console.log("4 ", JSON.parse(data.body).categories);

            setCategories(JSON.parse(data?.body).categories)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllCategory()
    }, [])

    return categories
}

export default useCategory