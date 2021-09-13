import axios from 'axios';
import {
    ADD_MENU,
    GET_MENU,
    CHANGE_STATE,
    CHANGE_MENU,
    DELETE_MENU
} from './types';
import { STORE_SERVER } from '../components/Config.js';
import { connect } from 'mongoose';

export function addMenu(dataToSubmit){
    const request = axios.post(`${STORE_SERVER}/stores_by_id/menu`, dataToSubmit)
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