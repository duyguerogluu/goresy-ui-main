import * as actionTypes from './actionTypes';

export const changeAppointments = (appointments) => {
	return {
        type: actionTypes.CHANGE_APPOINTMENTS,
        appointments
    };
};