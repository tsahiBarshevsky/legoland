import update from 'immutability-helper';

const INITIAL_STATE = [];

const productsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return action.products;
        case 'UPDATE_STOCK':
            const currentStock = state[action.payload.index].stock;
            return update(state, {
                [action.payload.index]: {
                    $merge: { stock: currentStock - action.payload.amount }
                }
            });
        default:
            return state;
    }
}

export default productsReducer;