import axios from 'axios';
import * as actionTypes from './actionTypes';
import {PartnerService} from "../../service/PartnerService";

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userDetails) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userDetails: userDetails
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const auth = (username, password) => {
    return dispatch => {
        const partnerService = new PartnerService();
        dispatch(authStart());
        const authData = `grant_type=password&username=${username}&password=${password}`
        axios.post(
            `${window.env.REACT_APP_GORESY_OAUTH_URL}/oauth/token`,
            authData,
            {
                headers: {
                    authorization: window.env.REACT_APP_GORESY_OAUTH_AUTH_HEADER,
                    "content-type": "application/x-www-form-urlencoded"
                }
            }
        )
            .then(authResponse => {
                const token = authResponse.data.access_token;

                axios.post(
                    `${window.env.REACT_APP_GORESY_OAUTH_URL}/users/username-email`,
                    {
                        username: username,
                        email: username
                    }
                )
                    .then(userDetailResponse => {
                        const userDetails = userDetailResponse.data;
                        const expirationDate = new Date(new Date().getTime() + authResponse.data.expires_in * 1000);
                        const authorities = [];

                        userDetailResponse.data.groups.forEach(group => {
                            authorities.push(...group.authorities)
                        })

                        axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partner-users-of-user/${userDetails.id}`)
                            .then(data => {
                                const partnerUsers = data && data.data && data.data.content;
                                if (partnerUsers && partnerUsers.length > 0) {

                                    partnerService.getPartnerById(partnerUsers[0].partnerId)
                                        .then(data => {
                                            userDetails.partner = data;
                                            userDetails.authorities = authorities;

                                            window.localStorage.setItem('token', token)
                                            window.localStorage.setItem('expirationDate', expirationDate)
                                            dispatch(authSuccess(token, userDetails));
                                            dispatch(checkAuthTimeout(authResponse.data.expires_in));
                                        })
                                }
                            })
                    })
                    .catch(err => {
                        dispatch(authFail(err.response.data.error));
                    });
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = window.localStorage.getItem('token');
        const partnerService = new PartnerService();

        dispatch(authStart());

        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(window.localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                axios.post(
                    `${window.env.REACT_APP_GORESY_OAUTH_URL}/oauth/check_token?token=${token}`
                )
                    .then(tokenDetailResponse => {
                        axios.post(
                            `${window.env.REACT_APP_GORESY_OAUTH_URL}/users/username-email`,
                            {
                                username: tokenDetailResponse.data.user_name,
                                email: tokenDetailResponse.data.user_name
                            }
                        )
                            .then(userDetailResponse => {
                                const userDetails = userDetailResponse.data;
                                const authorities = [];

                                userDetailResponse.data.groups.forEach(group => {
                                    authorities.push(...group.authorities)
                                })

                                axios.get(`${window.env.REACT_APP_GORESY_BACKEND_URL}/partner-users-of-user/${userDetails.id}`)
                                    .then(data => {
                                        const partnerUsers = data && data.data && data.data.content;
                                        if (partnerUsers && partnerUsers.length > 0) {

                                            partnerService.getPartnerById(partnerUsers[0].partnerId)
                                                .then(data => {
                                                    userDetails.partner = data;
                                                    userDetails.authorities = authorities;
                                                    console.log(authorities)
                                                    dispatch(authSuccess(token, userDetails));
                                                    dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
                                                })
                                        }
                                    })

                            })
                            .catch(err => {
                                dispatch(authFail(err.response.data.error));
                            });

                    })
                    .catch(() => {
                        dispatch(logout());
                    });
            }
        }
    };
};