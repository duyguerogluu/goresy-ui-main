import axios from "axios";
export class PartnerService {
    getPartners() {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partners`)
            .then(res => resolve(res.data));
        })
    }

    createPartner(partner, callback) {
        return new Promise(resolve => {
            axios.post(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partner`, partner)
            .then(res => resolve(res.data)).catch(
                function (error) {
                    callback(error)
                }
            );
        })
    }

    getPartnersByCreationOrder() {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partners?sort=createdDate,asc`)
                .then(res => resolve(res.data));
        })
    }

    getPartnerById(partnerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partners/${partnerId}`)
                .then(res => resolve(res.data));
        })
    }

    deletePartnerById(partnerId) {
        return new Promise(resolve => {
            axios.delete(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partners/${partnerId}`)
                .then(res => resolve(res.data));
        })
    }

    updateAppointmentSettingsByPartnerId(partnerId, appointmentSettings){
        return new Promise(resolve => { axios.put(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partner-appointment-settings/${partnerId}`, appointmentSettings).then(res => resolve(res.data));
        })
    }

    getClientRepresentitive() {
        return fetch('client-representitive.json').then(res => res.json())
        .then(d => d.data);
    }
}