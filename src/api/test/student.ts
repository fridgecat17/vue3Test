import request from '../../utils/request'
import { ResponseModel, listModel } from '../../utils/requestType'
enum API {
  getStudentList = '/students/getStudentList',
  setStudent = '/students/set-student',
  student = '/students/',
}
export const getStudentList = (data: any) => {
  return request.get<listModel>({ url: API.getStudentList, params: data, headers: { isToken: true } })
}
export const setStudent = (data: any) => {
  return request.post<ResponseModel>({ url: API.setStudent, data: data })
}
export const updateStudent = (data: any, id: string | number) => {
  return request.put<ResponseModel>({ url: API.student + id, data: data })
}
export const removeStudent = (id: string | number) => {
  return request.delete<ResponseModel>({ url: API.student + id })
}
// export const getStudentList = (data) => {
//   return request({
//     url: '/students/getStudentList',
//     method: 'get',
//     headers: { isToken: true },
//     params: data
//   })
// }

// export const setStudent = (data) => {
//   return request({
//     url: '/students/set-student',
//     method: 'post',
//     data: data
//   })
// }

// export const updateStudent = (data, id) => {
//   return request({
//     url: '/students/' + id,
//     method: 'post',
//     data: data
//   })
// }

// export const removeStudent = (id) => {
//   return request({
//     url: '/students/' + id,
//     method: 'delete'
//   })
// }
