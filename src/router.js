// import Vue from 'vue'
import Home from './views/Home.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/user',
      name: 'user',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/User'),
      children: [
        {
          path: '/user/words',
          name: 'userWords',
          meta: {
            requireAuth: true
          },
          component: () => import('./views/Words'),
        },
        {
          path: '/user/profile',
          name: 'userProfile',
          meta: {
            requireAuth: true
          },
          component: () => import('./views/Profile'),
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      meta: {
        requireAuth: true,
        root: true
      },
      component: () => import('./admin/views/Home'),
      children: [
        {
          path: '/admin/words',
          name: 'words',
          meta: {
            requireAuth: true,
            root: true
          },
          component: () => import('./admin/views/Words'),
        }
      ]
    }
  ]
})
