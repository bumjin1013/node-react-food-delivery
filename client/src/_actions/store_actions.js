import axios from 'axios';
import {
   ADD_MENU_STORE,
   GET_MENU
} from './types';
import { STORE_SERVER } from '../components/Config.js';

export function addMenu(dataToSubmit){
    const request = axios.post(`${STORE_SERVER}/stores_by_id/menu`, dataToSubmit)
        .then(response => response.data);
    
    return {
        type: ADD_MENU_STORE,
        payload: request
    }
}

export function getMenu(){
    const request = axios.get(`${STORE_SERVER}/stores_by_id/getMenu`)
        .then(response => response.data);
    
    return {
        type: GET_MENU,
        payload: request
    }
}


