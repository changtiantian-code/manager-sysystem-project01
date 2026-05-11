import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useLoginStore } from "../stores/login";

const request = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": 'application/json',
    },
    timeout: 5000,
});

    
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const loginStore = useLoginStore();
    const { token } = loginStore;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


request.interceptors.response.use((response: AxiosResponse) => {
    return response.data;
}, (error) => {
    return Promise.reject(error);
})


export default request;