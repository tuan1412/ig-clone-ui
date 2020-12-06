import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_API_URL
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
}, err => {
  return Promise.reject(err);
})

instance.interceptors.response.use(res => {
  if (res && res.data) {
    return res.data;
  }
  return res;
}, err => {
  return Promise.reject(err);
})

export default instance;