import update from 'immutability-helper';

const INITIAL_STATE = [];

const productsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return action.products;
        default:
            return state;
    }
}

export default productsReducer;