import axios from "axios";
export class CheckService {

    postCheck(check) {
        return axios.post(`${window.env.REACT_APP_GORESY_BACKEND_URL}/check`, check)
          .then(res => res.data);
    }

    getChecks(partnerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/checks-of-partner?partnerId=${partnerId}&sort=time`)
                .then(res => resolve(res.data));
        })
    }

    getCheck(checkId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/checks/${checkId}`)
                .then(res => resolve(res.data));
        })
    }

}