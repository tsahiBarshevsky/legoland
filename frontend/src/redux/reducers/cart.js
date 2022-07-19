import update from 'immutability-helper';

const INITIAL_STATE = {};

const cartReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_CART':
            return action.cart;
        case 'ADD_NEW_PRODUCT_TO_CART':
            return update(state, {
                products: {
                    $push: [action.payload.product]
                },
                sum: {
                    $set: action.payload.newSum
                }
            });
        // const newArray = update(oldArray, {
        //     people: {
        //         $push: [
        //             { name: 'Trevor', age: 45 },
        //         ]
        //     }
        // });
        default:
            return state;
    }
}

export default cartReducer;