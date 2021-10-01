// api/productApi.js 
import axiosClient from './axiosClient';

const AuthApi = {
    login: (params) => { 
        return axiosClient.post('/login', {
            ...params
        });
    },

    refreshToken: () => {
        return axiosClient.post('/refreshToken', {
            refresh_token: sessionStorage.getItem('refresh_token') ? sessionStorage.getItem('refresh_token') : null
        });
    },

    logout: () => {
        return axiosClient.post('/logout', {
            refresh_token: sessionStorage.getItem('refresh_token') ? sessionStorage.getItem('refresh_token') : null
        });
    }
}

export default AuthApi;