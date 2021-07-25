import {
    LOGIN_OWNER,
    REGISTER_OWNER,
    AUTH_OWNER,
    LOGOUT_OWNER,
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case REGISTER_OWNER:
            return {...state, register: action.payload }
        case LOGIN_OWNER:
            return { ...state, loginSucces: action.payload }
        case AUTH_OWNER:
            return {...state, ownerData: action.payload }
        case LOGOUT_OWNER:
            return {...state }
        default:
            return state;
    }
}