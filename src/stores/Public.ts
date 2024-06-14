import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RouteRecordRaw } from 'vue-router'
const powerList = ['/','/about','/addDept','/deptList','/game']
export const PublicStore = defineStore('Public', () => {
    const power: Array<string> = ref([])
    const navList = ref([])
    // 获取路由权限
    async function setPower() {
      // 通过接口请求权限
      this.power = powerList
      return true
    }
    // 写入菜单
    function setNav(route) {
      this.navList = route
    }
  return { power, navList, setPower,setNav }
})
