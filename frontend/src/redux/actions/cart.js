const addNewProductToCart = (product, newSum) => {
    return {
        type: 'ADD_NEW_PRODUCT_TO_CART',
        payload: {
            product: product,
            newSum: newSum
        }
    }
};

const updateProductInCart = (index, amount, type) => {
    return {
        type: 'UPDATE_PRODUCT_IN_CART',
        payload: {
            index: index,
            amount: amount,
            type: type
        }
    }
};

export { addNewProductToCart, updateProductInCart };