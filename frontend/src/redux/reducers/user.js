import update from 'immutability-helper';

const INITIAL_STATE = {};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.user;
        case 'UPDATE_ADDRESSES':
            if (action.payload.type === 'primary')
                return update(state, {
                    addresses: {
                        primary: {
                            $set: action.payload.address
                        }
                    }
                });
            return update(state, {
                addresses: {
                    secondary: {
                        $set: action.payload.address
                    }
                }
            });
        default:
            return state;
    }
}

export default userReducer;