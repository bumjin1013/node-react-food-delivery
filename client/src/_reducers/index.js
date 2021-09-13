import { combineReducers } from 'redux';
import user from './user_reducer';
import owner from './owner_reducer';
import store from './store_reducer';

const rootReducer = combineReducers({
    user, owner, store
});

export default rootReducer;