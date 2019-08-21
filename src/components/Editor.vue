<template>
  <div class="editor-container">
    <header class="title">
      我有新想法
      <Iconfont 
        class="title-icon" 
        :class="showFlag ? 'active' : ''" 
        icon="icon-think" 
        fontSize="20" 
        @click.native="editorShow"></Iconfont>
    </header>
    <div v-show="showFlag">
      <el-input 
        type="textarea"
        resize="none"
        rows="5"
        placeholder="我想说点儿什么..."
        @input="input"
        v-model="comment">
      </el-input>
      <footer>还可输入 {{ rest }}/500 字</footer>
      <el-button class="submit-btn" size="mini" type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import Iconfont from '@/components/Iconfont'
import API from '@/serviceAPI.config.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Editor',
  props: {
    wordID: {
      type: String,
      default: ''
    }
  },
  components: {
    Iconfont
  },
  data() {
    return {
      showFlag: false,
      length: 500,
      comment: '',
      submitting: false
    }
  },
  computed: {
    rest() {
      return this.length - this.comment.trim().length
    },
    ...mapGetters(['loginStatus', 'userInfo'])
  },
  methods: {
    editorShow() {
      if (this.loginStatus) {
        this.showFlag = !this.showFlag
      } else {
        this.setLoginVisiable(true)
        this.setLoginFlag(true)
      }
    },
    input() {
      if (this.comment.trim().length > 500) {
        this.comment = this.comment.trim().slice(0, 500)
      }
    },
    submit() {
      console.log(this.comment.trim())
      const comment = this.comment.trim().slice(0, 500)
      if (comment === '' || this.submitting) {
        return
      }
      this.$http.post(API.writeComment, {
        comment,
        userID: this.userInfo.id,
        wordID: this.wordID,
        toUser: ''
      }).then(res => {
        if (res.data.code === 1) {
          const newComment = {
            id: res.data.data.id,
            wordID: this.wordID,
            userID: this.userInfo.id,
            comment,
            toUser: '',
            name: this.userInfo.name,
            avatar: this.userInfo.avatar,
            createTime: res.data.data.createTime,
            like: 0
          }
          this.$emit('newComment', newComment, this.wordID)
          this.comment = ''
          this.showFlag = false
        }
      })
    },
    ...mapMutations({
      setLoginVisiable: 'SET_LOGINVISIABLE',
      setLoginFlag: 'SET_LOGINFLAG'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.editor-container {
  background: #fcfafa;
  padding: 10px;
  color: $color-gray;
  .title {
    font-weight: bold;
    font-size: 16px;
    // color: $color-black;
    .title-icon {
      cursor: pointer;
      &.active {
        color: $color-origin;
      }
    }
  }
  .submit-btn {
    margin-top: 10px;
  }
}
</style>
