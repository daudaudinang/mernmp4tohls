// api/productApi.js 
import axiosClient from './axiosClient';

const BASEURL = process.env.REACT_APP_BASE_URL_API_USER_SERVER;

const UserApi = {
    register: (params) => { 
        return axiosClient.post(BASEURL + '/register', { 
            ...params
        });
    },
    getUserList: () => {
        return axiosClient.post(BASEURL + '/getUserList', {
            
        });
    },
    getUser: (id) => {
        return axiosClient.post(BASEURL + '/getUser', {
            id: id
        });
    },
    addUser: (params) => {
        return axiosClient.post(BASEURL + '/addUser', {
            ...params
        });
    },
    editUser: (params) => {
        return axiosClient.post(BASEURL + '/editUser', {
            ...params
        });
    },
    removeUser: (id) => {
        return axiosClient.post(BASEURL + '/removeUser', {
            id:id
        });
    },
}

export default UserApi;