import {
   ADD_MENU_STORE,
   GET_MENU
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case ADD_MENU_STORE:
            return {...state, store: action.payload }
        case GET_MENU:
            return {...state, menu: action.payload }
        default:
            return state;
    }
}