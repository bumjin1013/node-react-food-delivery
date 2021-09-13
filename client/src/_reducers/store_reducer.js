import {
   ADD_MENU,
   GET_MENU,
   CHANGE_STATE,
   CHANGE_MENU,
   DELETE_MENU,
   GET_ORDER,
   UPDATE_ORDER_STATE,
   GET_REVIEW,
   ADD_COMMENTS
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case ADD_MENU:
            return {...state, menu: action.payload }
        case GET_MENU:
            return {...state, menu: action.payload }
        case CHANGE_STATE:
            return {...state, menu: action.payload }
        case CHANGE_MENU:
            return {...state, menu: action.payload }
        case DELETE_MENU:
            return {...state, menu: action.payload }
        case GET_ORDER:
            return {...state, order: action.payload }
        case UPDATE_ORDER_STATE:
            return {...state, order: action.payload }
        case GET_REVIEW:
            return {...state, review: action.payload }
        case ADD_COMMENTS:
            return {...state, review: action.payload}
        default:
            return state;
    }
}