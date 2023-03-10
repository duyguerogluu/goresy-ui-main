import axios from "axios";
export class ExpenseService {
    postExpense(expense) {
        return axios.post(`${window.env.REACT_APP_GORESY_BACKEND_URL}/expense`, expense)
            .then(res => res.data);
    }
}