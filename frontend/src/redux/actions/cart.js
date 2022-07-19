const addNewProductToCart = (product, newSum) => {
    return {
        type: 'ADD_NEW_PRODUCT_TO_CART',
        payload: {
            product: product,
            newSum: newSum
        }
    }
};

export { addNewProductToCart };