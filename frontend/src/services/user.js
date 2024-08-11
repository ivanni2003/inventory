import axios from 'axios'

const createUser = async (credentials) => {
    const response = await axios.post("http://localhost:3001/api/users", credentials)
    return response.data
}

const deleteUser = async (id, credentials) => {
    const response = await axios.delete(`${"http://localhost:3001/api/users"}/${id}`, credentials)
    return response.data
}

export default {createUser, deleteUser}