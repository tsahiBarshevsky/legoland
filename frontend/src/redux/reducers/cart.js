import update from 'immutability-helper';

const INITIAL_STATE = {};

const cartReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_CART':
            return action.cart;
        default:
            return state;
    }
}

export default cartReducer;