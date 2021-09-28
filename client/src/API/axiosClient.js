// api/axiosClient.js import axios from 'axios';
import queryString from 'query-string';
import axios from 'axios';

// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const axiosClient = axios.create({ 
    headers: {'content-type': 'application/json',}
,
paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {

    if(sessionStorage.getItem('access_token')) {
        config.headers = {
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
        }
    }
    // Handle token here ... 
    return config;
});

axiosClient.interceptors.response.use((response) => { 
    if (response && response.data) {
        return response.data;
    }

    return response;
}, (error) => {
    throw error;
});

export default axiosClient;