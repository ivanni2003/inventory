const Product = ({name, category, price, quantity}) => {
    return (
        <div>
            <div>{name}</div>
            <div>{category}</div>
            <div>{price}</div>
            <div>{quantity}</div>
        </div>
    )
}

export default Product