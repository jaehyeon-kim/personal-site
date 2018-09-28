import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Banana from '@/components/Banana'
import Blog from '@/components/blog/Blog'
import Article from '@/components/blog/Article';

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/banana',
    name: 'Banana',
    component: Banana,
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/blog/:id',
    name: 'Article',
    props: true,
    component: Article,
  }
]

// const scrollBehavior = (to, from, savedPosition) => {
//   if (savedPosition) {
//     return { x: 1000, y: 1000 }
//   } else {
//     return { x: 0, y: 0 }
//   }
// }

const router = new Router({
  mode: 'history',
  // scrollBehavior,
  routes: routes  
})

export default router
