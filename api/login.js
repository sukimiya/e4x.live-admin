import { getApi, postApi, requestDownload } from '~~/libs/api.request'

export const baseURL = 'http://e2x.cn:5089/'

export const login = (data) => postApi(`${baseURL}auth/login`, data)

export const logout = () => postApi(`${baseURL}auth/logout`)

export const getAllDevices = () => getApi(`${baseURL}up/getAllDevice`)

export const requestMv = (data) => getApi(`${baseURL}up/requiremv`, data)

export const downloadMv = ({ id, file }) => requestDownload(`${baseURL}/up/upstore/${id}/${file}`)

export default {
    login,
    logout,
    getAllDevices,
    requestMv,
    downloadMv
}