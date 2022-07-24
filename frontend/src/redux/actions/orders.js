const addNewOrder = (order) => {
    return {
        type: 'ADD_NEW_ORDER',
        payload: order
    }
};

export { addNewOrder };