import { combineReducers } from 'redux';
import user from './user_reducer';
import owner from './owner_reducer'
import chat from './chat_reducer';

const rootReducer = combineReducers({
    user, owner, chat
});

export default rootReducer;