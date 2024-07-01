import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getToken } from '../utils/auth'
import { PublicStore } from '@/stores/Public';
import HomeView from '../views/HomeView.vue'
const routesList: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    meta: {noAauth: true },
    component: () => import('../views/login.vue')
  },
  {
    path: '/',
    name: 'home',
    meta: {
      title:'USERLIST',
    },
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      title:'CREATEUSER',
    },
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/addDept',
    name: 'addDept',
    meta: {
      title:'CREATEDEPT',
    },
    component: () => import('../views/AddDeptView.vue')
  },
  {
    path: '/deptList',
    name: 'deptList',
    meta: {
      title:'DEPTLIST',
    },
    component: () => import('../views/DeptListView.vue')
  },
  {
    path: '/game',
    name: 'game',
    meta: {
      title:'GAME',
    },
    component: () => import('../views/game/GameView.vue')
  },
  {
    path: '/map',
    name: 'map',
    meta: {
      title:'MAP',
    },
    component: () => import('../views/MapView.vue')
  },
  // {
  //   path: '/vr',
  //   name: 'vr',
  //   meta: {
  //     title:'VR',
  //   },
  //   component: () => import('../views/vr/VRView.vue')
  // },
]
const routes:Array<RouteRecordRaw> = routesList.filter((i) => { // 过滤掉需要权限认证的路由
  return i.meta ? i.meta.noAauth : false;
});
const router = createRouter({ // 挂载不需要权限认证的路由
  history: createWebHistory(),
  routes,
});
const getRoutesAuth = (power:Array<string>) => { // 添加路由
  const powerList = routesList.filter((i) => { // 过滤掉不需要权限的路由 因为已经挂载过一次
      return !i.meta || !i.meta.noAauth
  })
  powerList.forEach(e => {
      if (power.includes('admin') || power.includes(e.path)) { //power(1)表示管理员权限全部挂载  判断权限列表是否包含当前路由 包含则挂载
        router.addRoute(e)
      }
  })
};
router.beforeEach(async(to, from, next) => {
  if (to.path !== '/login' && !getToken()) { // 判断是否登录  非`login`页面无`token`的话跳转到登录页面
      next({ path: '/login' });
  } else {
    const stores = PublicStore() // pinia 状态管理
    if (to.path !== '/login') {
      if (stores.power.length === 0) {
        // 判断是否获取过权限
        const res = await stores.setPower() // 获取权限列表
        if (res) {
          getRoutesAuth(stores.power) // 根据权限列表挂载路由
          if (stores.navList.length === 0) {
            stores.setNav(router.getRoutes())
          }
          next({...to, replace: true}) // 跳转页面
        } else { // 获取权限失败返回到来源页面
          next({ path: from.path, query: { hasPower: 1 } })
        }
      } else {
        getRoutesAuth(stores.power) // 根据权限列表挂载路由
        if (stores.navList.length === 0) {
          stores.setNav(router.getRoutes())
          next({...to, replace: true}) // 跳转页面
        } else {
          if (to.name) {
            if (router.hasRoute(to.name)) {
              next()
            }
          } else {
            next({...to, replace: true}) // 跳转页面
          }
        }
      }
    }
  }
})
export default router
