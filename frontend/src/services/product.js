import axios from 'axios'

const getAll = async () => {
    const response = await axios.get("http://localhost:3001/api/products")
    return response.data
}

export default {getAll}