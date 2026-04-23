import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import WorksPage from '../views/WorksPage.vue'
import CompositionsPage from '../views/CompositionsPage.vue'
import NewsPage from '../views/NewsPage.vue'
import MediaPage from '../views/MediaPage.vue'
import Login from '../views/LoginPage.vue'
import Admin from '../views/AdminPanel.vue'
import { auth } from '../firebase/config.js'

const requireAuth = (to, from, next) => {
  const user = auth.currentUser
  if (!user) {
    next( '/login' )
  } else {
    next()
  }
}

const requireNoAuth = (to, from, next) => {
  let user = auth.currentUser
  if (user) {
    next( '/admin' )
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/compositions',
    name: 'Compositions',
    component: CompositionsPage
  },
  {
    path: '/news',
    name: 'News',
    component: NewsPage
  },
  {
    path: '/works',
    name: 'Works',
    component: WorksPage
  },
  {
    path: '/media',
    name: 'Media',
    component: MediaPage
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: requireNoAuth
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: requireAuth
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router