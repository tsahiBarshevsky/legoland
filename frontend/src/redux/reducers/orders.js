import update from 'immutability-helper';

const INITIAL_STATE = [];

const ordersReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_ORDERS':
            return action.orders;
        case 'ADD_NEW_ORDER':
            return update(state, {
                $push: [action.payload]
            });
        default:
            return state;
    }
}

export default ordersReducer;