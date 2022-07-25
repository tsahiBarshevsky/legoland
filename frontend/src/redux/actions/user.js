const updateAddresses = (address, type) => {
    return {
        type: 'UPDATE_ADDRESSES',
        payload: {
            address: address,
            type: type
        }
    }
};

const updatePesonalDetails = (firstName, lastName, phone) => {
    return {
        type: 'UPDATE_PERSONAL_DETAILS',
        payload: {
            firstName: firstName,
            lastName: lastName,
            phone: phone
        }
    }
};

export { updateAddresses, updatePesonalDetails };