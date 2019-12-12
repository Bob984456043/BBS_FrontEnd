import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import articlelist from '@/components/articlelist'
import publish from '@/components/publish'
import articleview from '@/components/articleview'

Vue.use(VueRouter)
Vue.prototype.$axios = axios
const routes = [
  {
    path: '/',
    name: 'home',
    component:articlelist,
  },
  {
    path: '/article/:id',
    name: 'article',
    component:articleview,
  },
  {
    path: '/publish',
    name: 'publish',
    component: publish,
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
