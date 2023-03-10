import axios from "axios";

export class CalendarService {

    getCalendarEventsSmall(partnerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/appointments-of-partner?partnerId=${partnerId}`)
                .then(res => resolve(res.data));
        })
    }

    getCalendarEventsOfEmployee(employeeId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/appointments-of-employee?employeeId=${employeeId}`)
                .then(res => resolve(res.data));
        })
    }
}