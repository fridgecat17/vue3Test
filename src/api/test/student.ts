import request from '@/utils/request'

// 获取user对象
export const whoAreYou = () => {
  return request({
    url: '/students/who-are-you',
    method: 'get'
  })
}