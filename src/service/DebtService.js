import axios from "axios";
export class DebtService {

    postDebt(debt) {
        return axios.post(`${window.env.REACT_APP_GORESY_BACKEND_URL}/debt`, debt)
          .then(res => res.data);
    }

}