import request from '@/utils/request'

export const userLogin = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data: data
  })
}

export const register = (data) => {
  return request({
    url: '/user/register',
    method: 'post',
    data: data
  })
}

