import axios from "axios";

export class UsersService {

	setUserAuthorizations(userId, groupDtoList) {
		return new Promise((resolve, reject) => {
            axios.put(`${window.env.REACT_APP_GORESY_OAUTH_URL}/users/update-auths/${userId}`, groupDtoList)
                .then(res => resolve(res.data));
        })
	}

	getUserDetail(userId) {
		return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_OAUTH_URL}/users/${userId}`)
                .then(res => resolve(res.data))
        })
	}


        getPartnerUserByEmployeeId(employeeId) {
		return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partner-users-of-employee/${employeeId}`)
                 .then(res => resolve(res.data))
        })
	}

        getUserDetailByEmployeeId(employeeId) {
		return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partner-users-of-employee/${employeeId}`)
                .then(res => {
                        axios.get(`${window.env.REACT_APP_GORESY_OAUTH_URL}/users/${res.data.userId}`)
                                .then(resFromOauth => {
                                      resolve(resFromOauth.data);
                                })       
                })
        })
	}

        emailExists(email) {
		return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_OAUTH_URL}/users/email-exists/${email}`)
                .then(res => resolve(res.data))
        })
	}

        usernameExists(username) {
		return new Promise(resolve => {
            axios.get(`${window.env.REACT_APP_GORESY_OAUTH_URL}/users/username-exists/${username}`)
                .then(res => resolve(res.data))
        })
	}
	
}