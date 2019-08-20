// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import API from './serviceAPI.config'

Vue.config.productionTip = false
Vue.prototype.$http = axios

// 请求拦截
axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.common.Authorization = token
  }
  return config
}, error => {
  return Promise.reject(error);
})

// 路由守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  let requireAuth = to.meta.requireAuth
  let root = to.meta.root
  if (!token) {
    store.commit('SET_USERINFO', {userInfo: {}, status: false})
    requireAuth ? next({path: '/'}) : next()
  } else {
    axios.get(API.getUserInfo).then(res => {
      store.commit('SET_USERINFO', {userInfo: res.data.userInfo, status: res.data.loginStatus})
      if (requireAuth) {
        if (!res.data.loginStatus || (root && !res.data.userInfo.root)) {
          next({path: '/'})
        } else {
          next()
        }
      } else {
        next()
      }
      
    })
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
