import { combineReducers } from 'redux';
import user from './user_reducer';
import owner from './owner_reducer'


const rootReducer = combineReducers({
    user, owner
});

export default rootReducer;