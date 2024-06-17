import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import cache from '@/plugins/cache'
const powerList = ['/','/about','/addDept','/deptList','/game']
export const PublicStore = defineStore('Public', () => {
    const power: Array<string> = cache.session.getJSON('power') || []
    const navList = cache.session.getJSON('navList') || []
    // 获取路由权限
    async function setPower() {
      // 通过接口请求权限
      this.power = powerList
      cache.session.setJSON('power', this.power)
      return true
    }
    // 写入菜单
    function setNav(route) {
      this.navList = route
      cache.session.setJSON('navList', this.navList)
    }
  return { power, navList, setPower,setNav }
})
