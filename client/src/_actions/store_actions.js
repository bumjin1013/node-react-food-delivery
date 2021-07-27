import axios from 'axios';
import {
   ADD_MENU_STORE
} from './types';
import { STORE_SERVER } from '../components/Config.js';

export function addMenu(dataToSubmit){
    const request = axios.post(`${STORE_SERVER}/stores_by_id/menu/add`, dataToSubmit)
        .then(response => response.data);
    
    return {
        type: ADD_MENU_STORE,
        payload: request
    }
}


