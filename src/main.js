// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

Vue.config.productionTip = false
Vue.prototype.$http = axios

axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.common.Authorization = token
  }
  return config
}, error => {
  return Promise.reject(error);
})

router.beforeEach((to, from, next) => {
  console.log(to, from)
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
