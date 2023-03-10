import * as actionTypes from '../actions/actionTypes'

const initialState = []

const reducer = function (state = initialState, action) {
    switch (action.type){
        case actionTypes.CHANGE_APPOINTMENTS:
        {
            return action.appointments;
        }
        default:
            return state;
    }
};

export default reducer;