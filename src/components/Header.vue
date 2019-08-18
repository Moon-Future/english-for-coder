<template>
  <div class="header-container">
    <el-button type="primary" size="mini" @click="add">
      <Iconfont icon="icon-contribute" fontSize="14"></Iconfont>
      贡献
    </el-button>
    <word-form :visiable="formVisiable" :admin="false" :form="form" @wordForm="handleForm"></word-form>
  </div>
</template>

<script>
import Iconfont from '@/components/Iconfont'
import WordForm from '@/admin/components/WordForm'
export default {
  name: 'Header',
  components: {
    Iconfont,
    WordForm
  },
  data() {
    return {
      formVisiable: false,
      form: {
        word: '',
        mean: '',
        pronounce: '',
        examples: []
      }
    }
  },
  methods: {
    handleForm(flag) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.header-container {
  border-bottom: 1px solid $color-shallowgray;
  height: 50px;
  line-height: 50px;
  text-align: right;
  padding: 0 10px;
}
</style>
