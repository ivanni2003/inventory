import { useState, useEffect } from 'react'

import loginService from './services/login'
import userService from './services/user'
import productService from './services/product'

import Product from './components/Product'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)  // current user

  const [allProducts, setAllProducts] = useState([])   // all products in database
  const [userProducts, setUserProducts] = useState([])  // all products of current user

  const [createPage, setCreatePage] = useState(false)   // displaying create product page 
  const [updatePage, setUpdatePage] = useState(false)   // displaying update product page

  // creating products
  const [newProductName, setNewProductName] = useState('')
  const [newProductCategory, setNewProductCategory] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newProductQuantity, setNewProductQuantity] = useState('');

  // updating products
  const [updateProductId, setUpdateProductId] = useState('')
  const [updateProductName, setUpdateProductName] = useState('')
  const [updateProductCategory, setUpdateProductCategory] = useState('')
  const [updateProductPrice, setUpdateProductPrice] = useState('')
  const [updateProductQuantity, setUpdateProductQuantity] = useState('')

  // filter by category
  const [filter, setFilter] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])

  // effects 
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      productService.setToken(user.token)
      
    }
  }, [])

  useEffect(() => {  
    productService
      .getAll()
      .then(initialProducts => {
        setAllProducts(initialProducts)
      })
  }, [allProducts])

  useEffect(() => {
    if (allProducts.length > 0 && user) {
      console.log(allProducts)
      setUserProducts(allProducts.filter(product => product.user.id === user.id))
    }
  }, [allProducts, user])
  

  // pages 
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
              autoComplete="on"
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
      <h1>Welcome {user.username}</h1>
      <div>Filter by Category:
        <input value={filter} onChange={handleFilterChange}/>
      </div>
      {filter === '' ? (userProducts.map(product => (
        <Product
          key={product.id}
          name={product.name}
          category={product.category}
          price={product.price}
          quantity={product.quantity}
          deleteProduct={() => handleDeleteProduct(product.id)}
          updateProductPage={() => handleSwitchToUpdatePage(product.name, product.id)}/>
      ))) : (filteredProducts.map(product => (
        <Product
          key={product.id}
          name={product.name}
          category={product.category}
          price={product.price}
          quantity={product.quantity}
          deleteProduct={() => handleDeleteProduct(product.id)}
          updateProductPage={() => handleSwitchToUpdatePage(product.name, product.id)}/>)))
      }
      <button type="button" onClick={handleSwitchToCreatePage}>Create Product</button>
      <button type="button" onClick={handleLogout}>Log Out</button>
      <button type="button" onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  )

  const createProductPage = () => (
    <div>
      <h1>Create Product</h1>
      <form>
        <div>
          name:
          <input type="text" 
                  value={newProductName} 
                  name="newProductName" 
                  onChange={({target}) => setNewProductName(target.value)} 
                  />
        </div>
        <div>
          category:
          <input type="text" 
                  value={newProductCategory} 
                  name="newProductCategory" 
                  onChange={({target}) => setNewProductCategory(target.value)} 
                  />
        </div>
        <div>
          price:
          <input type="text" 
                  value={newProductPrice} 
                  name="newProductPrice" 
                  onChange={({target}) => setNewProductPrice(target.value)} 
                  />
        </div>
        <div>
          quantity:
          <input type="text" 
                  value={newProductQuantity} 
                  name="newProductQuantity" 
                  onChange={({target}) => setNewProductQuantity(target.value)} 
                  />
        </div>
        <button type="button" onClick={handleCreateProduct}>Create Product</button>
        <button type="button" onClick={handleExitCreate}>Exit</button>
      </form>
    </div>
  )

  const updateProductPage = (name, id) => (
    <div>
      <h1>Update {name}</h1>
      <form>
        <div>
          category:
          <input type="text" 
                  value={updateProductCategory} 
                  name="updateProductCategory" 
                  onChange={({target}) => setUpdateProductCategory(target.value)} 
                  />
        </div>
        <div>
          price:
          <input type="text" 
                  value={updateProductPrice} 
                  name="updateProductPrice" 
                  onChange={({target}) => setUpdateProductPrice(target.value)} 
                  />
        </div>
        <div>
          quantity:
          <input type="text" 
                  value={updateProductQuantity} 
                  name="updateProductQuantity" 
                  onChange={({target}) => setUpdateProductQuantity(target.value)} 
                  />
        </div>
        <button type="button" onClick={handleUpdateProduct}>Update Product</button>
        <button type="button" onClick={handleExitUpdate}>Exit</button>
      </form>
    </div>
  )

  // user account handlers 
  const handleLogin = async (event, register) => {
    if (!register) {
      event.preventDefault()
    }

    try {
      const user = await loginService.login({username: username, password: password})

      window.localStorage.setItem(
        "loggedUser", JSON.stringify(user)
      )

      productService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setUserProducts(allProducts.filter(product => product.user.id === user.id))
    }
    catch (exception) {
      alert("Invalid credentials")
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()

    if (username == '' || password == '') {
      alert("Please Provide Username and Password")
      return;
    }

    try {
      await userService.createUser({username: username, password: password})
      handleLogin(event, true)
    }
    catch (exception) {
      alert("Registration Error")
    }

  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.clear()

    productService
      .getAll()
      .then(initialProducts => {
        setAllProducts(initialProducts)
      })
  }

  const handleDeleteAccount = async (event) => {
    event.preventDefault()

    try {
      await userService.deleteUser(user.id, {username: username, password: password})
      setUser(null)

      productService
        .getAll()
        .then(initialProducts => {
          setAllProducts(initialProducts)
        })
      alert("Account Deleted")
    }
    catch (exception) {
      alert("Accound Deletion Error")
    }
  }

  // switch page handlers 
  const handleSwitchToUpdatePage = (name, id) => {
    setUpdatePage(true)
    setUpdateProductName(name)
    setUpdateProductId(id)

  }
  const handleSwitchToCreatePage = (event) => {
    event.preventDefault()
    setCreatePage(true)
  }

  // exit page handlers 
  const handleExitCreate = (event) => {
    event.preventDefault()
    setCreatePage(false)
  }

  const handleExitUpdate = (event) => {
    event.preventDefault()
    setUpdatePage(false)
  }

  // filter handler
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setFilteredProducts(userProducts.filter(product => product.category.toLowerCase().includes(filter.toLowerCase())))
  }

  // CRUD operation handlers
  const handleCreateProduct = async (event) => {
    event.preventDefault()

    try {
      const product = await productService.createProduct({name: newProductName, category: newProductCategory, price: Number(newProductPrice), quantity: Number(newProductQuantity), userID: user.id})
      setNewProductName('')
      setNewProductCategory('')
      setNewProductPrice('')
      setNewProductQuantity('')

      setAllProducts(allProducts.concat(product))
      setUserProducts(userProducts.concat(product))

      alert("Product Created")
    }
    catch (exception) {
      alert("create error")
    }
  }

  const handleUpdateProduct = async (event) => {
    event.preventDefault()

    try {
      const updatedProduct = await productService.updateProduct(updateProductId, {name: updateProductName, category: updateProductCategory, price: Number(updateProductPrice), quantity: Number(updateProductQuantity)})
      setUpdateProductName('')
      setUpdateProductId('')
      setUpdateProductCategory('')
      setUpdateProductPrice('')
      setUpdateProductQuantity('')

      setAllProducts(allProducts.map(product => product.id === updatedProduct.id ? updatedProduct : product))
      setUserProducts(allProducts.filter(product => product.user.id === user.id))
      alert("Product Updated")
    }
    catch (exception) {
      alert("Update Product Error")
    }
  }

  
  const handleDeleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id, {username, password})
      setAllProducts(allProducts.filter(product => product.id != id))
      setUserProducts(userProducts.filter(product => product.id != id))
      alert("Product Deleted")
    }
    catch (exception) {
      alert("Delete Product Error")
    }
  }
  return (
    <div>
      {updatePage === true ? updateProductPage(updateProductName, updateProductId) : createPage === true ? createProductPage() : user === null ?
      loginPage() :
      productPage()}
      

    </div>
  )
}

export default App
