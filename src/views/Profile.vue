<template>
  <div class="userwords-container">
    <div class="content">
      <div class="info-wrapper">
        <h1>个人信息</h1>
        <el-form ref="infoForm" :model="infoForm" :rules="infoRules" class="form" width="500px" label-position="left">
          <el-form-item label="头像" label-width="80px">
            <img class="avatar" :src="userInfo.avatar || avatar" alt="">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :action="uploadUrl"
              :headers="headers"
              :limit="1"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-progress="uploadProgress"
              :on-error="uploadError"
              :on-success="uploadSuccess">
              <el-button size="mini" type="primary">选择文件</el-button>
              <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="账号" label-width="80px">
            <p>{{ userInfo.account }}</p>
          </el-form-item>
          <el-form-item label="昵称" prop="name" label-width="80px">
            <el-input v-model="infoForm.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" label-width="80px">
            <el-input v-model="infoForm.email"></el-input>
          </el-form-item>
          <el-form-item label="网站" label-width="80px">
            <el-input 
            type="textarea" 
            resize="none"
            rows="5" 
            v-model="infoForm.website"></el-input>
          </el-form-item>
        </el-form>
        <el-button class="submit-btn" size="mini" type="primary" @click="updateSubmit('infoForm')" :loading="submitting1">保存</el-button>
      </div>
      <div class="password-wrapper" v-if="!userInfo.id.includes('Github')">
        <h1>修改密码</h1>
        <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" class="form" width="500px" label-position="left">
          <el-form-item label="原密码" prop="old" label-width="80px">
            <el-input type="password" v-model="passwordForm.old"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new" label-width="80px">
            <el-input type="password" v-model="passwordForm.new"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="reNew" label-width="80px">
            <el-input type="password" v-model="passwordForm.reNew"></el-input>
          </el-form-item>
        </el-form>
        <el-button class="submit-btn" size="mini" type="primary" @click="updateSubmit('passwordForm')" :loading="submitting2">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
const crypto = require('crypto')
import { mapGetters } from 'vuex'
import API from '@/serviceAPI.config.js'
import { mapMutations } from 'vuex'
export default {
  name: 'userProfile',
  components: {
    
  },
  data() {
    const pattern = /^[\w._-]{6,16}$/
    return {
      avatar: require('../assets/avatar.jpg'),
      submitting1: false,
      submitting2: false,
      infoForm: {
        name: '',
        email: '',
        website: ''
      },
      infoRules: {
        name: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        email: [
          {type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur'},
          {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
        ],
      },
      passwordForm: {
        old: '',
        new: '',
        reNew: ''
      },
      passwordRules: {
        old: [
          {required: true, message: '请输入原密码', trigger: 'blur'},
        ],
        new: [
          {required: true, validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入新密码'))
            } else if (!pattern.test(value.trim())) {
              callback(new Error('6 ~ 16位，可包含字母 数字 _ - .'))
            } else {
              callback()
            }
          }}
        ],
        reNew: [
          {required: true, validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请重复新密码'))
            } else if (value !== this.passwordForm.new) {
              callback(new Error('两次密码不一致'))
            } else {
              callback()
            }
          }}
        ]
      },
      headers: {}
    }
  },
  created() {
    this.uploadUrl = API.upload
    this.headers = {Authorization: localStorage.getItem('token')}
    this.infoForm = {name: this.userInfo.name, email: this.userInfo.email}
    let website = ''
    this.userInfo.website.forEach(item => {
      website += `[${item.name}](${item.url}),\n`
    })
    Vue.set(this.infoForm, 'website', website)
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    }),
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 < 500

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 500kb!')
      }
      return isJPG && isLt2M
    },
    uploadProgress() {
      this.loadingMask = this.$loading()
    },
    uploadSuccess(res) {
      this.$refs.upload.clearFiles()
      this.loadingMask.close()
      if (res.code === 1) {
        let userInfo = this.userInfo
        userInfo.avatar = res.data.avatar
        this.$message.success(res.message)
        this.setUserInfo({userInfo, status: true})
        localStorage.setItem('token', res.data.token)
      } else {
        this.$message.error(res.message)
      }
    },
    uploadError() {
      this.$refs.upload.clearFiles()
      this.loadingMask.close()
      this.$message.error('上次失败')
    },
    updateSubmit(form) {
      this.$refs[form].validate(valid => {
        if (!valid) {
          return false
        }
        if ((form === 'infoForm' && this.submitting1) || (form === 'infoForm' && this.submitting2)) {
          return
        }
        let subForm = {}, webstr = '', flag = false
        if (form === 'infoForm') {
          subForm.info = true
          subForm.name = this.infoForm.name
          subForm.email = this.infoForm.email
          subForm.website = this.infoForm.website
        } else {
          subForm.info = false
          subForm.old = this.passwordForm.old.trim()
          subForm.newPass = this.passwordForm.new.trim()
          subForm.reNew = this.passwordForm.reNew.trim()
          subForm.old = crypto.createHash('sha1').update(subForm.old).digest('hex')
          subForm.newPass = crypto.createHash('sha1').update(subForm.newPass).digest('hex')
          subForm.reNew = crypto.createHash('sha1').update(subForm.reNew).digest('hex')
        }
        this.userInfo.website.forEach(item => {
          webstr += `[${item.name}](${item.url})`
        })
        if (subForm.name != this.userInfo.name || subForm.email != this.userInfo.email || subForm.website.trim().replace(/\n|,/g, '') != webstr) {
          flag = true
        }
        if (!flag) {
          this.$message.success('无需更新')
          return
        }
        if (form === 'infoForm') {
          this.submitting1 = true
        } else {
          this.submitting2 = true
        }
        this.$http.post(API.updateUserInfo, subForm).then(res => {
          if (res.data.code === 1) {
            this.$message.success(res.data.message)
            let data = res.data.data
            if (data) {
              this.setUserInfo({userInfo: res.data.data.userInfo, status: true})
              localStorage.setItem('token', res.data.data.token)
            } else {
              this.passwordForm.old = ''
              this.passwordForm.new = ''
              this.passwordForm.reNew = ''
              this.$refs[form].resetFields()
            }
          } else {
            this.$message.error(res.data.message)
          }
          if (form === 'infoForm') {
            this.submitting1 = false
          } else {
            this.submitting2 = false
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.content {
  width: 80%;
  margin: 20px auto 0;
}
h1 {
  font-weight: bold;
  text-align: left;
  font-size: 1.2rem;
}
.info-wrapper, .password-wrapper {
  background: $color-white;
  padding: 50px;
  border-radius: 4px;
  margin-bottom: 30px;
}
.form {
  width: 500px;
  margin-top: 20px;
  p {
    text-align: left;
    font-weight: bold;
    font-size: 20px;
  }
}
.avatar {
  width: 50px;
  height: 50px;
  float: left;
}
.submit-btn {
  float: left;
}
</style>