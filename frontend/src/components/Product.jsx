const Product = ({name, category, price, quantity, deleteProduct, updateProductPage}) => {
    return (
        <div>
            <div>Name: {name}</div>
            <div>Category: {category}</div>
            <div>Price: {price}</div>
            <div>Quantity: {quantity}</div>
            <button onClick={deleteProduct}>Delete</button>
            <button onClick={updateProductPage}>Update</button>
        </div>
    )
}

export default Product