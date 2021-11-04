import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';


//we have an action called setAlert that's going to dispatch the type of SET_ALERT to the reducer
//Reducer is alert.js and it's going to add the alert to the state 
export const setAlert = (msg, alertType) => dispatch => {
    const id = uuidv4();
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });
};