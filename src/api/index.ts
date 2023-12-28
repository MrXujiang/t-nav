import req from '@/utils/req';

interface LoginApiType {
    name: string;
    pwd: string;
}

export const loginApi = (data: LoginApiType) => req.post('/login', data)

interface ListApiType {
    type: string;
    sub_type: string;
    keyword: string;
    page: number;
    pagesize: number;
}
export const getListApi = (params: ListApiType) => req.get('/list', {params})

interface AddListApiType {
    title: string, 
    desc: string, 
    type: string, 
    sub_type: string, 
    tags: string[], 
    star: number, 
    img: any[], 
    url: string
}

export const addListApi = (data: AddListApiType) => req.post('/add', data)

interface ModListApiType {
    id: string;
    title: string, 
    desc: string, 
    type: string, 
    sub_type: string, 
    tags: string[], 
    star: number, 
    img: any[], 
    url: string
}

export const modListApi = (data: ModListApiType) => req.put('/mod', data)

export const delListApi = (id: string) => req.delete(`/del?id=${id}`)

export const getDetailApi = (id: string) => req.get(`/detail?id=${id}`)

export const getWxConfigApi = (url: string) => req.post('/wechat/getConfig', { url })