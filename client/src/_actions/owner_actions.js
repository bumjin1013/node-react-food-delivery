import axios from 'axios';
import {
    LOGIN_OWNER,
    REGISTER_OWNER,
    AUTH_OWNER,
    LOGOUT_OWNER,
} from './types';
import { OWNER_SERVER } from '../components/Config.js';

export function registerOwner(dataToSubmit){
    const request = axios.post(`${OWNER_SERVER}/register/owner`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_OWNER,
        payload: request
    }
}

export function loginOwner(dataToSubmit){
    const request = axios.post(`${OWNER_SERVER}/login/owner`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_OWNER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${OWNER_SERVER}/auth/owner`)
    .then(response => response.data);

    return {
        type: AUTH_OWNER,
        payload: request
    }
}

export function logoutOwner(){
    const request = axios.get(`${OWNER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_OWNER,
        payload: request
    }
}
