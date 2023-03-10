import axios from "axios";

export class PartnerUserService {

    getPartnerUserByEmployeeId(employeeId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partner-users-of-employee/${employeeId}`)
                .then(res => resolve(res.data));
        })
    }

}