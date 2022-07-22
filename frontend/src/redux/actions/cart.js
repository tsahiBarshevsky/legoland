const addNewProductToCart = (product, newSum) => {
    return {
        type: 'ADD_NEW_PRODUCT_TO_CART',
        payload: {
            product: product,
            newSum: newSum
        }
    }
};

const updateProductInCart = (index, amount, type, price) => {
    return {
        type: 'UPDATE_PRODUCT_IN_CART',
        payload: {
            index: index,
            amount: amount,
            type: type,
            price: price
        }
    }
};

const removeProductFromCart = (index, sum) => {
    return {
        type: 'REMOVE_PRODUCT_FROM_CART',
        payload: {
            index: index,
            sum: sum
        }
    }
};

const emptyCart = () => {
    return {
        type: 'EMPTY_CART'
    }
}

export { addNewProductToCart, updateProductInCart, removeProductFromCart, emptyCart };