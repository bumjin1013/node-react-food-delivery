import axios from 'axios';
import {
    ADD_MENU,
    GET_MENU,
    CHANGE_STATE,
    CHANGE_MENU,
    DELETE_MENU,
    GET_ORDER,
    UPDATE_ORDER_STATE,
    GET_REVIEW,
    ADD_COMMENTS,
    ADD_DELIVERY_AREA,
    GET_DELIVERY_AREA
} from './types';
import { STORE_SERVER } from '../components/Config.js';

export function addMenu(body){
    const request = axios.post(`${STORE_SERVER}/addMenu`, body)
        .then(response => response.data);
    
    return {
        type: ADD_MENU,
        payload: request
    }
}

export function getMenu(storeId){
    const request = axios.get(`${STORE_SERVER}/menu/storeId?id=${storeId}&type=single`)
        .then(response => response.data);
    
    return {
        type: GET_MENU,
        payload: request
    }
}

export function changeState(body){
    const request = axios.post(`${STORE_SERVER}/changestate`, body)
        .then(response => response.data);
    
    return {
        type: CHANGE_STATE,
        payload: request
    }
}

export function changeMenu(body) {
    const request = axios.post(`${STORE_SERVER}/changemenu`, body)
        .then(response => response.data);
    
    return {
        type: CHANGE_MENU,
        payload: request
    }
}

export function deleteMenu(body){
    const request = axios.post(`${STORE_SERVER}/deletemenu`, body)
        .then(response => response.data);
    
    return {
        type: DELETE_MENU,
        payload: request
    }
}

export function getOrder(storeId){
    const request = axios.get(`${STORE_SERVER}/order/storeId?id=${storeId}&type=single`)
        .then(response => response.data);
    
    return {
        type: GET_ORDER,
        payload: request
    }
}

export function updateOrderState(body){
    const request = axios.post(`${STORE_SERVER}/updateorderstate`, body)
        .then(response => response.data);
    
    return {
        type: UPDATE_ORDER_STATE,
        payload: request
    }
}

export function getReview(storeId){
    const request = axios.get(`${STORE_SERVER}/review/storeId?id=${storeId}&type=single`)
        .then(response => response.data);
    
    return {
        type: GET_REVIEW,
        payload: request
    }
}

export function addcomments(body){
    const request = axios.post(`${STORE_SERVER}/addcomments`, body)
        .then(response => response.data);
    
    return {
        type: ADD_COMMENTS,
        payload: request
    }
}

export function getDeliveryArea(storeId){
    const request = axios.get(`${STORE_SERVER}/getDeliveryArea?storeId=${storeId}&type=single`)
        .then(response => response.data);
    
    return {
        type: GET_DELIVERY_AREA,
        payload: request
    }
}

export function addDeliveryArea(body){
    const request = axios.post(`${STORE_SERVER}/addDeliveryArea`, body)
        .then(response => response.data);
    
    return {
        type: ADD_DELIVERY_AREA,
        payload: request
    }
}