<template>
  <div class="user-container">
    <el-table
      :data="userData"
      size="mini">
      <el-table-column
        prop="avatar"
        label="头像">
        <template slot-scope="props">
          <img class="avatar" :src="props.row.avatar" alt="">
        </template>
      </el-table-column>
      <el-table-column
        v-for="(field, i) in  fields"
        :key="i"
        :prop="field.prop"
        :label="field.label">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import API from '@/serviceAPI.config.js'
import { dateFormat } from '@/common/js/util' 
export default {
  name: 'words',
  components: {

  },
  data() {
    return {
      userData: [],
      fields: [
        {prop: 'account', label: '账户'},
        {prop: 'name', label: '昵称'},
        {prop: 'email', label: '邮箱'},
        {prop: 'lastTime', label: '最近登陆'},
        {prop: 'createTime', label: '注册时间'},
      ]
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.$http.get(API.getUser, {

      }).then(res => {
        if (res.data.code === 1) {
          res.data.data.forEach(item => {
            item.createTime = dateFormat(item.createTime, 'yyyy-MM-dd hh:mm')
            item.lastTime = dateFormat(item.lastTime, 'yyyy-MM-dd hh:mm')
            item.account = item.account || 'Github'
          })
          this.userData = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  width: 50px;
  height: 50px;
}
</style>
