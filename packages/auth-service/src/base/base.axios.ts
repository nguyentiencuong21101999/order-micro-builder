import axios, { AxiosRequestConfig } from 'axios'

export class BaseAxios {
    constructor() {}
    request = async <T>(axiosReqConfig: AxiosRequestConfig) => {
        try {
            const res = await axios(axiosReqConfig)
            return res.data
        } catch (err) {
            throw err
        }
    }
}
