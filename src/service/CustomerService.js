
import axios from "axios";
export class CustomerService {

    getCustomersOfPartner(partnerId, query) {
        const queryParam = query ? `&query=${query}` : "";
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/customers-of-partner?partnerId=${partnerId}${queryParam}`)
                .then(res => resolve(res.data));
        })
    }

    getCustomers(partnerId) {
        return fetch(`${window.env.REACT_APP_GORESY_BACKEND_URL}/customers?partnerId=${partnerId}`).then(res => res.json())
                .then(d => d.content);
    }

    postCustomer(customer) {
        return axios.post(`${window.env.REACT_APP_GORESY_BACKEND_URL}/customer`, customer)
          .then(d => d.data);
    }

    getCustomerSmallcustomerId() {
        return fetch('customer-large.json').then(res => res.json())
                .then(d => d.data);
    }

    getCustomerReservation(partnerId, customerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/appointments-of-customer/${partnerId}?customerId=${customerId}&sort=id,desc`)
                .then(res => resolve(res.data));
        })
    }

    getCustomerLarge(customerId) {
        return fetch('customer-large.json').then(res => res.json())
                .then(d => d.data);
    }

    getCustomerRewardPoints(partnerId, customerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/reward-points-of-customer/${partnerId}?customerId=${customerId}&sort=id,desc`)
                .then(res => resolve(res.data));
        })
    }

    getCustomerProductSales(partnerId, customerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/product-sales-of-customer/${partnerId}?customerId=${customerId}&sort=id,desc`)
                .then(res => resolve(res.data));
        })
    }

    getCustomerPackageSales(partnerId, customerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/product-sales-of-customer/${partnerId}?customerId=${customerId}&sort=id,desc`)
                .then(res => resolve(res.data));
        })
    }

    getCustomerDebts(partnerId,customerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/credits-of-customer/${partnerId}?customerId=${customerId}&sort=id,desc`)
                .then(res => resolve(res.data));
        })
    }

    getCustomerReviews(partnerId,customerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/comments-of-customer/${partnerId}?customerId=${customerId}&sort=id,desc`)
                .then(res => resolve(res.data));
        })
    }

    getCustomerPayments(partnerId,customerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/payments-of-customer/${partnerId}?customerId=${customerId}&sort=id,desc`)
                .then(res => resolve(res.data));
        })
    }

    getCustomerPhotos(partnerId,customerId) {
        return fetch('customer-files.json').then(res => res.json())
                .then(d => d.data);
    }

    getCustomerFiles(partnerId,customerId) {
        return fetch('customer-files.json').then(res => res.json())
                .then(d => d.data);
    }

    getCustomer(params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        return fetch('https://www.primefaces.org/data/Customer?' + queryParams).then(res => res.json())
    }

    getCustomerById(customerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/customers/${customerId}`)
                .then(res => resolve(res.data));
        })
    }
}