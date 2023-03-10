import axios from "axios";
export class CreditService {
    postCredit(credit) {
        return axios.post(`${window.env.REACT_APP_GORESY_BACKEND_URL}/credit`, credit)
            .then(res => res.data);
    }
}