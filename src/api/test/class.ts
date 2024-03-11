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

export const updateClass = (data, id) => {
  return request({
    url: '/class/' + id,
    method: 'post',
    data: data
  })
}

export const removeClass = (id) => {
  return request({
    url: '/class/' + id,
    method: 'delete'
  })
}