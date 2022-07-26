const updateStock = (index, amount) => {
    return {
        type: 'UPDATE_STOCK',
        payload: {
            index: index,
            amount: amount
        }
    }
};

export { updateStock };