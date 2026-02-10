import axios from 'axios';
import { statusCode } from '../../utils/StatusCode/StatusCode';

export const baseURL = 'http://localhost:7001';
export const baseURLFile = 'http://localhost:7001';
// export const baseURL = 'https://animal.parenting.genicminds.com/api';
// export const baseURLFile = 'https://animal.parenting.genicminds.com';

const api = axios.create({
    baseURL,
    baseURLFile,
});


api.interceptors.request.use((config) => {
    try {
        const localStorageAuthToken = localStorage.getItem("authToken");
        const sessionStorageAuthToken = sessionStorage.getItem("authToken");
        const authToken = sessionStorageAuthToken || localStorageAuthToken; 
        if (authToken) {
            config.headers['authorization'] = `Bearer ${authToken}`;
        } else {
            console.warn("No auth token found in localStorage.");
        }
    } catch (error) {
        console.error("Error accessing localStorage:", error);
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === statusCode.Unauthorized) {
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("authToken");
            localStorage.removeItem("userData");
            sessionStorage.removeItem("userData");
        }
        return Promise.reject(error);
    }
);

export default api;
