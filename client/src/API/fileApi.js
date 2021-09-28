// api/productApi.js 
import axiosClient from './axiosClient';

const BASEURL = process.env.REACT_APP_BASE_URL_API_DATA_SERVER;

const FileApi = {
    getFile: () => {
        return axiosClient.post(BASEURL + '/getFile', { 
            
        });
    },
    uploadFile: (formData) => {
        return axiosClient.post(BASEURL + '/uploadFile', formData, { 
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    removeFile: (id) => {
        return axiosClient.post(BASEURL + '/removeFile', { 
            id: id
        });
    },

}

export default FileApi;