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
    GET_DELIVERY_AREA,
    DELETE_DELIVERY_AREA
} from './types';
import { STORE_SERVER } from '../components/Config.js';

export function addMenu(body){
    const request = axios.post(`${STORE_SERVER}/menu`, body)
        .then(response => response.data);
    
    return {
        type: ADD_MENU,
        payload: request
    }
}

export function getMenu(storeId){
    const request = axios.get(`${STORE_SERVER}/menu?id=${storeId}&type=single`)
        .then(response => response.data);
    
    return {
        type: GET_MENU,
        payload: request
    }
}

export function changeState(body){
    const request = axios.put(`${STORE_SERVER}/state`, body)
        .then(response => response.data);
    
    return {
        type: CHANGE_STATE,
        payload: request
    }
}

export function changeMenu(body) {
    const request = axios.put(`${STORE_SERVER}/menu`, body)
        .then(response => response.data);
    
    return {
        type: CHANGE_MENU,
        payload: request
    }
}

export function deleteMenu(body){
    const request = axios.delete(`${STORE_SERVER}/menu`, {
        data : body
    })
        .then(response => response.data);
    
    return {
        type: DELETE_MENU,
        payload: request
    }
}

export function getOrder(storeId){
    const request = axios.get(`${STORE_SERVER}/order?id=${storeId}&type=single`)
        .then(response => response.data);
    
    return {
        type: GET_ORDER,
        payload: request
    }
}

export function updateOrderState(body){
    const request = axios.put(`${STORE_SERVER}/order-state`, body)
        .then(response => response.data);
    
    return {
        type: UPDATE_ORDER_STATE,
        payload: request
    }
}

export function getReview(storeId){
    const request = axios.get(`${STORE_SERVER}/review?id=${storeId}&type=single`)
        .then(response => response.data);
    
    return {
        type: GET_REVIEW,
        payload: request
    }
}

export function addcomments(body){
    const request = axios.post(`${STORE_SERVER}/comments`, body)
        .then(response => response.data);
    
    return {
        type: ADD_COMMENTS,
        payload: request
    }
}

export function getDeliveryArea(storeId){
    const request = axios.get(`${STORE_SERVER}/area?storeId=${storeId}&type=single`)
        .then(response => response.data);
    
    return {
        type: GET_DELIVERY_AREA,
        payload: request
    }
}

export function addDeliveryArea(body){
    const request = axios.post(`${STORE_SERVER}/area`, body)
        .then(response => response.data);
    
    return {
        type: ADD_DELIVERY_AREA,
        payload: request
    }
}

export function deleteDeliveryArea(body){

    const request = axios.delete(`${STORE_SERVER}/area`, {
        data : body
    })
        .then(response => response.data);
    
    return {
        type: DELETE_DELIVERY_AREA,
        payload: request
    }
}