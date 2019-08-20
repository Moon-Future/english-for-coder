<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import API from '@/serviceAPI.config.js'
import { mapMutations } from 'vuex'
export default {
  created() {
    // let token = localStorage.getItem('token')
    // if (!token) {
    //   this.setUserInfo({userInfo: {}, status: false})
    // }
    // axios.post(API.getUserInfo, {token}).then(res => {
    //   this.setUserInfo({userInfo: res.data.userInfo, status: res.data.loginStatus})
    // })
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    })
  }
}
</script>


<style lang="scss">
@import '@/common/css/reset.scss';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
