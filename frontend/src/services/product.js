import axios from 'axios'

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
  }

const getAll = async () => {
    const response = await axios.get("http://localhost:3001/api/products")
    return response.data
}

const deleteProduct = async (id, credentials) => {
    const response = await axios.delete(`${"http://localhost:3001/api/products"}/${id}`, credentials)
    return response.data
}

const createProduct = async (name, category, price, quantity, id) => {
    const config = {
        headers: { Authorization: token },
      }

      const data = {
        name,
        category,
        price,
        quantity,
        user: id
    };

    const response = await axios.post("http://localhost:3001/api/products", data, config);
    
    return response.data
}

const updateProduct = async (name, category, price, quantity, id) => {
    const data = {
        name,
        category,
        price, 
        quantity,
    }
    const response = await axios.put(`${"http://localhost:3001/api/products"}/${id}`, data, id)
    return response.data
}

export default {getAll, deleteProduct, createProduct, updateProduct, setToken}