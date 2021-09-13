import {
   ADD_MENU,
   GET_MENU,
   CHANGE_STATE,
   CHANGE_MENU,
   DELETE_MENU
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case ADD_MENU:
            return {...state, store: action.payload }
        case GET_MENU:
            return {...state, menu: action.payload }
        case CHANGE_STATE:
            return {...state, menu: action.payload }
        case CHANGE_MENU:
            return {...state, menu: action.payload }
        case DELETE_MENU:
            return {...state, menu: action.payload }
        default:
            return state;
    }
}