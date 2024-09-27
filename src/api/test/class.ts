import request from '../../utils/request'
import { ResponseModel, listModel } from '../../utils/requestType'
enum API {
  getClassList = '/class/getClassList',
  setClass = '/class/set-class',
  class = '/class/'
}
export const getClassList = (data: any) => {
  return request.get<listModel>({ url: API.getClassList, params: data })
}

export const setClass = (data: any) => {
  return request.post<ResponseModel>({ url: API.setClass, data: data })
}
export const updateClass = (data: any, id: number) => {
  return request.put<ResponseModel>({ url: API.class + id, data: data })
}
export const removeClass = (id: number) => {
  return request.delete<ResponseModel>({ url: API.class + id })
}
// export const setClass = (data) => {
//   return request({
//     url: '/class/set-class',
//     method: 'post',
//     data: data
//   })
// }

// export const getClassList = (data) => {
//   return request({
//     url: '/class/getClassList',
//     method: 'get',
//     params: data
//   })
// }

// export const updateClass = (data, id) => {
//   return request({
//     url: '/class/' + id,
//     method: 'post',
//     data: data
//   })
// }

// export const removeClass = (id) => {
//   return request({
//     url: '/class/' + id,
//     method: 'delete'
//   })
// }
