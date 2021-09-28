// api/productApi.js 
import axiosClient from './axiosClient';
const BASEURL = process.env.REACT_APP_BASE_URL_API_AUTH_SERVER;

const AuthApi = {
    login: (params) => { 
        return axiosClient.post(BASEURL + '/login', {
            ...params
        });
    },

    refreshToken: () => {
        return axiosClient.post(BASEURL + '/refreshToken', {
            refresh_token: sessionStorage.getItem('refresh_token') ? sessionStorage.getItem('refresh_token') : null
        });
    },

    logout: () => {
        return axiosClient.post(BASEURL + '/logout', {
            refresh_token: sessionStorage.getItem('refresh_token') ? sessionStorage.getItem('refresh_token') : null
        });
    }
}

export default AuthApi;