import axios from 'axios'
import { message } from 'antd'

export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token)

const instance = axios.create({
    baseURL: `${serverApi}/api/v0/mark`,
    timeout: 10000,
    // withCredentials: true
});

// 添加请求拦截器
instance.interceptors.request.use(function (config: any) {
    // 在发送请求之前做些什么
    config.headers = {
        'x-requested-with': 'mark',
        'Authorization': `Bearer ${getToken()}`,
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if(response.headers['x-show-msg'] === 'cxzk_msg_200') {
        message.success(response.data.msg, 2);
    }
    return response.data;
  }, function (error) {
    // 对响应错误做点什么
    const { response } = error;
    if(response && response.status === 404) {
        message.error('请求资源未发现');
    }else if(response.status === 403) {
        message.error(response.data.msg);
    }else {
        message.error(response.data.msg);
    }
    return Promise.reject(error);
  });



export default instance