import axios from "axios";

export class CityService {

    getCityList() {
        return axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/cities`)
          .then(res => res.data);
    }

    getDistrictListByCityId(cityId) {
        return axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/city/${cityId}/districts`)
          .then(res => res.data);
    }

}

export default CityService;