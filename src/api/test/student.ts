import request from '@/utils/request'

// 获取user对象
export const whoAreYou = (data) => {
  return request({
    url: '/students/who-are-you',
    method: 'get',
    headers: { isToken: false },
    params: data
  })
}
export const getStudentList = (data) => {
  return request({
    url: '/students/getStudentList',
    method: 'get',
    headers: { isToken: false },
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

