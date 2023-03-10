import axios from "axios";

export class AuthoritiesService {

	getAuthorities() {
		return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_OAUTH_URL}/authorities`)
                .then(res => resolve(res.data));
        })
	}
	
}