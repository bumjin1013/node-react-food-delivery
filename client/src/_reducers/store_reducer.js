import {
   ADD_MENU_STORE
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case ADD_MENU_STORE:
            return {...state, store: action.payload }
       
        default:
            return state;
    }
}