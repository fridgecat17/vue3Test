import request from '@/utils/request'

export const getStudentList = (data) => {
  return request({
    url: '/students/getStudentList',
    method: 'get',
    headers: { isToken: true },
    params: data
  })
}

export const setStudent = (data) => {
  return request({
    url: '/students/set-student',
    method: 'post',
    data: data
  })
}

export const updateStudent = (data, id) => {
  return request({
    url: '/students/' + id,
    method: 'post',
    data: data
  })
}

export const removeStudent = (id) => {
  return request({
    url: '/students/' + id,
    method: 'delete'
  })
}
