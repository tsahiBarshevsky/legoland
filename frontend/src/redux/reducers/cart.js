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
            if (action.payload.type === 'increment') {
                const newAmount = state.products[action.payload.index].amount + action.payload.amount;
                return update(state, {
                    products: {
                        [action.payload.index]: {
                            $merge: {
                                amount: newAmount,
                                sum: newAmount * action.payload.price
                            }
                        }
                    },
                    sum: {
                        $set: state.sum + (action.payload.amount * action.payload.price)
                    }
                });
            }
            else {
                const newAmount = state.products[action.payload.index].amount - action.payload.amount;
                return update(state, {
                    products: {
                        [action.payload.index]: {
                            $merge: {
                                amount: newAmount,
                                sum: newAmount * action.payload.price
                            }
                        }
                    },
                    sum: {
                        $set: state.sum - (action.payload.amount * action.payload.price)
                    }
                });
            }
        case 'REMOVE_PRODUCT_FROM_CART':
            return update(state, {
                products: {
                    $splice: [[action.payload.index, 1]]
                },
                sum: {
                    $set: state.sum - action.payload.sum
                }
            });
        case 'EMPTY_CART':
            return update(state, {
                products: {
                    $set: []
                },
                sum: {
                    $set: 0
                }
            });
        default:
            return state;
    }
}

export default cartReducer;