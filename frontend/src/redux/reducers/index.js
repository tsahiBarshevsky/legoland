import { combineReducers } from "redux";
import cartReducer from './cart';
import productsReducer from './products';
import userReducer from './user';

const rootReducer = combineReducers({
    cart: cartReducer,
    products: productsReducer,
    user: userReducer
});

export default rootReducer;