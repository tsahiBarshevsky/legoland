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
        case 'UPDATE_PRODUCT_IN_CART':
            if (action.payload.type === 'increment')
                return update(state, {
                    products: {
                        [action.payload.index]: {
                            $merge: {
                                amount: state.products[action.payload.index].amount + action.payload.amount
                            }
                        }
                    }
                });
            else
                return update(state, {
                    products: {
                        [action.payload.index]: {
                            $merge: {
                                amount: state.products[action.payload.index].amount - action.payload.amount
                            }
                        }
                    }
                });
        default:
            return state;
    }
}

export default cartReducer;