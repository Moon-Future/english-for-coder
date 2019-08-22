<template>
  <div class="header-container">
    <div class="hedaer-menu">
      <router-link class="header-logo" to="/">English 4 Coder</router-link>
      <ul class="menu-wrapper">
        <li @click="add" v-if="formStatus">
          <Iconfont icon="icon-contribute"></Iconfont>
          <span>贡献</span>
        </li>
        <li v-if="!loginStatus">
          <span class="menu-item-login" @click="login">登陆</span>
          <span @click="register">注册</span>
        </li>
        <li v-else class="user-wrapper">
          <el-dropdown trigger="click">
            <div class="avatar">
              <span>{{ userInfo.name }}</span>
              <img :src="userInfo.avatar || avatar" alt="">
            </div>
            <el-dropdown-menu slot="dropdown" class="user-menu">
              <template v-for="(item, i) in dropdownList">
                <el-dropdown-item
                  v-if="item.root && userInfo.root || !item.root"
                  :key="i"
                  @click.native="goPage(item.path)">
                  <Iconfont :icon="item.icon"></Iconfont>{{ item.name }}
                </el-dropdown-item>
              </template>
              <el-dropdown-item @click.native="logout">
                <Iconfont icon="icon-logout"></Iconfont>登出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
    <div v-if="formStatus">
      <Login></Login>
      <word-form :visiable="formVisiable" :admin="false" :form="form" @wordForm="wordForm"></word-form>
    </div>
  </div>
</template>

<script>
import Iconfont from '@/components/Iconfont'
import WordForm from '@/admin/components/WordForm'
import Login from '@/components/Login'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Header',
  props: {
    formStatus: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Iconfont,
    WordForm,
    Login
  },
  data() {
    return {
      formVisiable: false,
      loginVisiable: false,
      loginFlag: true,
      form: {
        word: '',
        mean: '',
        pronounce: '',
        examples: []
      },
      dropdownList: [
        {icon: 'icon-setting', path: '/admin/words', name: '后台管理', root: true},
        {icon: 'icon-user', path: '/user/words', name: '我的主页'}
      ],
      avatar: require('../assets/avatar.jpg')
    }
  },
  computed: {
    ...mapGetters(['loginStatus', 'userInfo'])
  },
  methods: {
    wordForm(flag) {
      this.formVisiable = flag
    },
    add() {
      this.formVisiable = true
      this.form = {
        word: '',
        mean: '',
        pronounce: '',
        examples: []
      }
    },
    login() {
      this.setLoginVisiable(true)
      this.setLoginFlag(true)
    },
    register() {
      this.setLoginVisiable(true)
      this.setLoginFlag(false)
    },
    logout() {
      localStorage.removeItem('token')
      this.setUserInfo({userInfo: {}, status: false})
      this.$router.push({path: '/'})
    },
    goPage(path) {
      if (this.$route.path === path) {
        return
      }
      this.$router.push({path})
    },
    ...mapMutations({
      setUserInfo: 'SET_USERINFO',
      setLoginVisiable: 'SET_LOGINVISIABLE',
      setLoginFlag: 'SET_LOGINFLAG'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.header-container {
  border-bottom: 1px solid $color-shallowgray;
  
  .hedaer-menu {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    .header-logo {
      cursor: pointer;
    }
  }

  .menu-wrapper {
    display: flex;
    justify-content: flex-end;
    li {
      margin: 0 10px;
      color: $color-blue;
      font-weight: bold;
      span {
        font-weight: bold;
        cursor: pointer;
      }
      .menu-item-login::after {
        content: ' · '
      }
      &.user-wrapper .avatar {
        cursor: pointer;
        display: flex;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin: auto 0 auto 5px;
        }
      }
    }
  }
}

.user-menu {
  li {
    color: $color-gray;
  }
}
</style>
