import request from '../../utils/request'
import { ResponseModel } from '../../utils/requestType'
enum API {
  login = '/auth/login',
  register = '/user/register'
}

export const userLogin = (data: any) => {
  return request.post<ResponseModel>({ url: API.login, data: data, headers: { noToken: true } })
}

export const register = (data) => {
  return request.post<ResponseModel>({ url: API.register, data: data, headers: { noToken: true } })
}
