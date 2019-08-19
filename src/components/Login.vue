<template>
  <div class="login-container">
    <el-dialog 
      :title="loginFlag ? '登陆' : '注册'"
      width="26rem"
      :visible.sync="visiable" 
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
                :type="field.prop === 'password' || field.prop === 'rePassword' ? 'text' : 'text'"
                v-if="field.prop !== 'website'" 
                v-model="form[field.prop]" 
                :placeholder="field.login || field.placeholder"></el-input>
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
      <el-button class="submit-btn" type="primary" @click.native="submit">{{ loginFlag ? '登陆' : '注册' }}</el-button>
      <div class="form-message" v-show="loginFlag">
        <span>没有账号？</span>
        <span class="span-link" @click="changeFlag(false)">注册</span>
        <span class="span-link right">忘记密码</span>
      </div>
      <p class="has-account" v-show="!loginFlag" @click="changeFlag(true)">已有账号登陆</p>
      <div class="other-login">
        <p>第三方账号登陆：</p>
        <div class="other-list">
          <img src="https://b-gold-cdn.xitu.io/v3/static/img/wechat.e0ff124.svg" alt="">
          <img src="https://b-gold-cdn.xitu.io/v3/static/img/github.547dd8a.svg" alt="">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/serviceAPI.config.js'
export default {
  name: 'Login',
  props: {
    visiable: {
      type: Boolean,
      default: false
    },
    loginFlag: { // 是否登陆界面
      type: Boolean,
      default: false
    }
  },
  data() {
    const pattern = /^[\w._-]{6,16}$/
    return {
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
          {type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur'}
        ],
        password: [
          {required: true, validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'))
            } else if (!pattern.test(value.trim())) {
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
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    close() {
      this.$emit('loginForm', false)
    },
    changeFlag(flag) {
      this.$emit('changeFlag', flag)
      this.$refs.loginForm.resetFields()
    },
    submit() {
      console.log(this.form)
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          return false
        }
        console.log(API.register)
        this.$http.post(API.register, this.form).then(res => {

        })
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
  cursor: pointer;
  text-align: center;
  margin: 15px;
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
