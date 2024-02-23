import request from '@/utils/request'

export const setClass = (data) => {
  return request({
    url: '/class/set-class',
    method: 'post',
    data: data
  })
}

export const getClassList = (data) => {
  return request({
    url: '/class/getClassList',
    method: 'get',
    params: data
  })
}
