import update from 'immutability-helper';

const INITIAL_STATE = {};

const wishListReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_WISH_LIST':
            return action.wishList;
        case 'ADD_NEW_PRODUCT_TO_WISH_LIST':
            return update(state, {
                products: {
                    $push: [action.payload]
                }
            });
        case 'REMOVE_PRODUCT_FROM_WISH_LIST':
            return update(state, {
                products: {
                    $splice: [[action.payload, 1]]
                }
            });
        default:
            return state;
    }
}

export default wishListReducer;