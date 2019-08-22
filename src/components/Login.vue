<template>
  <div class="login-container">
    <el-dialog 
      :title="loginFlag ? '登陆' : '注册'"
      width="26rem"
      :visible.sync="loginVisiable" 
      :close-on-click-modal="false" 
      @close="close">
      <el-form ref="loginForm" :model="form" :rules="rules">
        <template v-for="(field, i) in fields">
          <el-form-item :key="i" v-if="!loginFlag || (loginFlag && field.login)" :prop="field.prop">
            <template v-if="field.prop === 'emailCode'">
              <div class="emailcode-wrapper">
                <el-input v-model="form[field.prop]" :placeholder="field.placeholder"></el-input>
                <el-button type="primary">获取验证码</el-button>
              </div>
            </template>
            <template v-else>
              <el-input 
                :type="field.prop === 'password' || field.prop === 'rePassword' ? 'password' : 'text'"
                v-if="field.prop !== 'website'" 
                v-model="form[field.prop]" 
                :placeholder="field.login || field.placeholder" @keyup.enter.native="login"></el-input>
              <el-input v-else 
                type="textarea" 
                resize="none"
                rows="5"
                v-model="form[field.prop]"
                :placeholder="field.placeholder"></el-input>
            </template>
          </el-form-item>
        </template>
      </el-form>
      <el-button class="submit-btn" type="primary" :loading="submitting" @click.native="submit">{{ loginFlag ? '登陆' : '注册' }}</el-button>
      <div class="form-message" v-show="loginFlag">
        <span>没有账号？</span>
        <span class="span-link" @click="changeFlag(false)">注册</span>
        <!-- <span class="span-link right">忘记密码</span> -->
      </div>
      <p class="has-account" v-show="!loginFlag">
        <span @click="changeFlag(true)">已有账号登陆</span>
      </p>
      <div class="other-login">
        <p>第三方账号登陆：</p>
        <div class="other-list">
          <img src="https://b-gold-cdn.xitu.io/v3/static/img/wechat.e0ff124.svg" alt="">
          <img src="https://b-gold-cdn.xitu.io/v3/static/img/github.547dd8a.svg" alt="" @click="otherLogin('github')">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const crypto = require('crypto')
import API from '@/serviceAPI.config.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Login',
  data() {
    const pattern = /^[\w._-]{6,16}$/
    return {
      submitting: false,
      form: {
        account: '',
        password: '',
        rePassword: '',
        // emailCode: '',
        name: '',
        website: ''
      },
      fields: [
        {prop: 'account', placeholder: '请输入邮箱', login: '请输入邮箱'},
        {prop: 'password', placeholder: '请输入密码（不少于6位）', login: '请输入密码'},
        {prop: 'rePassword', placeholder: '请重复密码'},
        // {prop: 'emailCode', placeholder: '请输入邮箱验证码'},
        {prop: 'name', placeholder: '请输入昵称'},
        {prop: 'website', placeholder: '请输入个人网站，最多3个，逗号分割；[Github](https://github.com/Moon-Future/webpack-mvc-multipage),[知乎](www.zhihu.com)'}
      ],
      rules: {
        account: [
          {type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur'},
          {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'))
            } else if (!this.loginFlag && !pattern.test(value.trim())) {
              callback(new Error('6 ~ 16位，可包含字母 数字 _ - .'))
            } else {
              callback()
            }
          }}
        ],
        rePassword: [
          {required: true, validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请重复密码'))
            } else if (value !== this.form.password) {
              callback(new Error('两次密码不一致'))
            } else {
              callback()
            }
          }}
        ],
        name: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['loginVisiable', 'loginFlag'])
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO',
      setLoginVisiable: 'SET_LOGINVISIABLE',
      setLoginFlag: 'SET_LOGINFLAG'
    }),
    close() {
      this.setLoginVisiable(false)
    },
    changeFlag(flag) {
      this.setLoginFlag(flag)
      this.$refs.loginForm.resetFields()
    },
    otherLogin(name) {
      this.$loading()
      const client_id = window.location.host.includes('localhost') ? 'd5f5205584c80bdb5f16' : '5b329c08da31f808bd35'
      if (name === 'github') {
        var href = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=user:email`
        window.location.href = href
      }
    },
    login() {
      if (!this.loginFlag) {
        return
      }
      this.submit()
    },
    submit() {
      const { account, password } = this.form
      this.$refs.loginForm.validate((valid) => {
        if (!valid || this.submitting) {
          return false
        }
        this.submitting = true
        if (this.loginFlag) { // 登陆
          this.$http.post(API.login, {
            account: this.form.account,
            password: crypto.createHash('sha1').update(this.form.password.trim()).digest('hex')
          }).then(res => {
            if (res.data.code === 1) {
              this.$message.success(res.data.message)
              const token = res.data.data.token
              const userInfo = res.data.data.userInfo
              // 存入token
              localStorage.setItem('token', token)
              this.setUserInfo({userInfo, status: true})
              this.setLoginVisiable(false)
            } else {
              this.$message.error(res.data.message)
            }
            this.submitting = false
          })
        } else { // 注册
          this.$http.post(API.register, {
            account: this.form.account,
            password: crypto.createHash('sha1').update(this.form.password.trim()).digest('hex'),
            rePassword: crypto.createHash('sha1').update(this.form.rePassword.trim()).digest('hex'),
            name: this.form.name,
            website: this.form.website
          }).then(res => {
            if (res.data.code === 1) {
              this.$message.success(res.data.message)
              this.changeFlag(true)
              this.form.account = account
              this.form.password = password
            } else {
              this.$message.error(res.data.message)
            }
            this.submitting = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.login-container {
  text-align: left;
}

.emailcode-wrapper {
  display: flex;
}

.submit-btn {
  width: 100%;
}

.form-message {
  padding: 15px 0;
  .span-link {
    color: $color-blue;
    cursor: pointer;
  }
}
.has-account {
  color: $color-blue;
  text-align: center;
  margin: 15px;
  span {
    cursor: pointer;
  }
}

.other-login {
  .other-list {
    display: flex;
    justify-content: center;
    img {
      margin: 10px 20px 0 20px;
      cursor: pointer;
      background:$color-shallowgray;
      border-radius: 50%;
      padding: 5px;
    }
  }
}
</style>
