const addNewProductToWishList = (product) => {
    return {
        type: 'ADD_NEW_PRODUCT_TO_WISH_LIST',
        payload: product
    }
};

const removeProductFromWishList = (index) => {
    return {
        type: 'REMOVE_PRODUCT_FROM_WISH_LIST',
        payload: index
    }
};

export { addNewProductToWishList, removeProductFromWishList }