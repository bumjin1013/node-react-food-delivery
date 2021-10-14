import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    UPDATE_ADDRESS,
    UPDATE_HISTORY_STATE,
    GET_HISTORY
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function addToCart(body){
   
    const request = axios.post(`${USER_SERVER}/cart`, body)
    .then(response => response.data);

    return {
        type: ADD_TO_CART,
        payload: request
    }
}

export function getCartItems() {

    const request = axios.get(`${USER_SERVER}/cart`)
    .then(response => response.data);

    return {
        type: GET_CART_ITEMS,
        payload: request
    }
}

export function removeCartItem(body) {

    const request = axios.delete(`${USER_SERVER}/cart`, {
        data : body 
    })
    .then(response => response.data);

    return {
        type: REMOVE_CART_ITEM,
        payload: request
    }
}

export function updateAddress(body) {
    const request = axios.post(`${USER_SERVER}/address`, body)
    .then(response => response.data);

    return {
        type: UPDATE_ADDRESS,
        payload: request
    }
}

export function updatehistoryState(body) {
    const request = axios.post(`${USER_SERVER}/history`, body)
    .then(response => response.data);

    return {
        type: UPDATE_HISTORY_STATE,
        payload: request
    }
}

//소켓 통신을 위함
export function getHistory() {
    const request = axios.get(`${USER_SERVER}/history`)
    .then(response => response.data);

    return {
        type: GET_HISTORY,
        payload: request
    }
}