import axios from "axios";

export class ServiceCategoryService {

    getServiceCategoryList(partnerId) {
        return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/service-categories-of-partner?partnerId=${partnerId}`).then(res => resolve(res.data));
        })
    }
}