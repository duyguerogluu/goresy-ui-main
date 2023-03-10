import axios from "axios";
export class AppointmentService {

    postAppointment(appointment) {
        return new Promise(resolve => {
            axios.post(`${window.env.REACT_APP_GORESY_BACKEND_URL}/appointment`, appointment)
                .then(res => resolve(res.data));
        })
    }

    postOffHour(offHour) {
        return new Promise(resolve => {
            axios.post(`${window.env.REACT_APP_GORESY_BACKEND_URL}/off-hour`, offHour)
                .then(res => resolve(res.data));
        })
    }

    getOffHours(partnerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/off-hours-of-partner/${partnerId}`)
                .then(res => resolve(res.data));
        })
    }

    deleteOffHour(offHourId) {
        return new Promise(resolve => {
            axios.delete(`${window.env.REACT_APP_GORESY_BACKEND_URL}/off-hours/${offHourId}`)
                .then(res => resolve(res.data));
        })
    }

    getAppointments(partnerId, startDate, endDate) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/appointments-of-partner?partnerId=${partnerId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&sort=startTime,desc`)
                .then(res => resolve(res.data));
        })
    }

    getAppointmentServices(partnerId, startDate, endDate) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/appointment-services-of-partner?partnerId=${partnerId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&sort=startTime,desc`)
                .then(res => resolve(res.data));
        })
    }

    getAppointment(appointmentId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/appointments/${appointmentId}`)
                .then(res => resolve(res.data));
        })
    }

    updateAppointmentAttendStatus(appointmentId, status) {
        return new Promise(resolve => {
            axios.put(`${window.env.REACT_APP_GORESY_BACKEND_URL}/appointments/${appointmentId}/attend-status`, `"${status}"`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => resolve(res.data));
        })
    }

}