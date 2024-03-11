import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/addDept',
      name: 'addDept',
      component: () => import('../views/AddDeptView.vue')
    },
    {
      path: '/deptList',
      name: 'deptList',
      component: () => import('../views/DeptListView.vue')
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue')
    },
  ]
})

export default router
