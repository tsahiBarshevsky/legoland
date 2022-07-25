import { combineReducers } from "redux";
import cartReducer from './cart';
import productsReducer from './products';
import userReducer from './user';
import ordersReducer from './orders';
import wishListReducer from './wishList';

const rootReducer = combineReducers({
    cart: cartReducer,
    products: productsReducer,
    user: userReducer,
    orders: ordersReducer,
    wishList: wishListReducer
});

export default rootReducer;