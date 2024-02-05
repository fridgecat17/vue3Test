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
export const getStudentList = () => {
  return request({
    url: '/students/getStudentList',
    method: 'get',
    headers: { isToken: false },
  })
}

export const setStudent = (data) => {
  return request({
    url: '/students/set-student',
    method: 'post',
    data: data
  })
}

