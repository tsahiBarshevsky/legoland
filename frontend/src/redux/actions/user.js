const updateAddresses = (address, type) => {
    return {
        type: 'UPDATE_ADDRESSES',
        payload: {
            address: address,
            type: type
        }
    }
};

export { updateAddresses };