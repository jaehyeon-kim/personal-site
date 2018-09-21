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
    component: Blog,
  },
  {
    path: '/blog/:id',
    name: 'Article',
    props: true,
    component: Article,
  }
]

const router = new Router({
  mode: 'history',
  routes: routes
})

export default router
