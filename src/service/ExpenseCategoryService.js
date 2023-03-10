import axios from "axios";
export class ExpenseCategoryService {
    getExpenseCategoriesSortedBCreationDate(partnerId) {
        return axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/expense-categories-of-partner?partnerId=${partnerId}&sort=createdDate,desc`)
            .then(res => res.data);
    }

    postExpenseCategory(expenseCategory) {
        return axios.post(`${window.env.REACT_APP_GORESY_BACKEND_URL}/expense-category`, expenseCategory)
            .then(res => res.data);
    }

    deleteExpenseCategories(expenseCategoryId) {
        return axios.delete(`${window.env.REACT_APP_GORESY_BACKEND_URL}/expense-categories/${expenseCategoryId}`)
            .then(res => res.data);
    }
}