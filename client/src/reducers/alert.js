//This is a reducer
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const initialState = [

];

//Action contains two things, type is mandatory, and data is option
//we evaluate type 
//state is immutable
export default function (state = initialState, action) {
    //destructure the payload 
    const { type, payload } = action;

    switch (type) {
        // switch (action.type) {
        case SET_ALERT:
            //Have to include previous states from state = initialState, action
            //payload can be called something else
            //payload has action.payload.msg/id/alerttype
            //Will add a new alert to the array 
            return [...state, payload];
        // return [...state, action.payload];

        case REMOVE_ALERT:
            //return state which is an array and filter 
            //payload is just the id 
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}

