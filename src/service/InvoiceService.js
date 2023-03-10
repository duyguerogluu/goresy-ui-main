import axios from "axios";

export class InvoiceService {
    
    getInvoices() {
        return fetch(`${window.env.REACT_APP_GORESY_BACKEND_URL}/goresy-invoices`).then(res => res.json())
                .then(d => d);
    }
    getInvoicesOfPartner(partnerId) {
        return fetch(`${window.env.REACT_APP_GORESY_BACKEND_URL}/goresy-invoices-of-partner?partnerId=${partnerId}`).then(res => res.json())
                .then(d => d);
    }
}