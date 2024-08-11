import { useState } from 'react'
import loginService from './services/login'
import userService from './services/user'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const loginPage = () => (
    <div> 
      <p> Inventory Manager </p>
      <form>
        <div>
          username: 
            <input type="text" 
                  value={username} 
                  name="Username" 
                  onChange={({target}) => setUsername(target.value)} 
                  />
        </div>

        <div>
          password:
            <input
              type="password"
              value={password}
              name="password"
              onChange={({target}) => setPassword(target.value)}
              />
        </div>
        <button type="button" onClick={handleLogin}>Log In</button>
        <button type="button" onClick={handleRegister}>Register</button>
      </form>
      </div>
    
  )

  const productPage = () => (
    <div>
      <h1>Welcome user</h1>
      <button type="button" onClick={handleLogout}>Log Out</button>
      <button type="button" onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  )

  const handleLogin = async (event) => {
    event.preventDefault()
    //console.log("logging in with", username, password)

    try {
      const user = await loginService.login({username, password})
      console.log(user)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      alert("Invalid credentials")
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    //console.log("registering with", username, password)

    if (username == '' || password == '') {
      alert("Please Provide Username and Password")
      return;
    }

    try {
      const user = await userService.createUser({username, password})
      console.log(user)

      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      alert("Registration Error")
    }

  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
  }

  const handleDeleteAccount = async (event) => {
    event.preventDefault()
    console.log("deleting", user._id)

    try {
      const response = await userService.deleteUser(user.id, {username, password})
      setUser(null)
      alert("Account Deleted")
    }
    catch (exception) {
      alert("Accound Deletion Error")
    }
  }
  return (
    <div>
      {user === null ?
      loginPage() :
      productPage()
      }

    </div>
  )
}

export default App
