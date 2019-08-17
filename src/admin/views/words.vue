<template>
  <div class="words-container">
    <div class="btn-wrapper">
      <el-button type="primary" size="mini" @click="formVisiable = true">新增</el-button>
    </div>
    <el-table
      :data="wordsList"
      stripe
      size="mini"
      style="width: 100%">
      <el-table-column
        v-for="(field, i) in fields"
        :key="i"
        :prop="field.prop"
        :label="field.label">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <word-form :visiable="formVisiable" @wordForm="handleForm"></word-form>
  </div>
</template>

<script>
import WordForm from '@/admin/components/WordForm'
import API from '@/serviceAPI.config.js'
export default {
  name: 'words',
  components: {
    WordForm
  },
  data() {
    return {
      wordsList: [],
      fields: [
        {prop: 'word', label: '单词'},
        {prop: 'letter', label: '首字母'},
        {prop: 'mean', label: '意思'},
        {prop: 'pronounce', label: '发音'},
        {prop: 'counter', label: '热度'}
      ],
      formVisiable: false
    }
  },
  created() {
    this.$http.get(API.wordsList, {
      params: {letter: 'hot'}
    }).then(res => {
      this.wordsList = res.data.data
    })
  },
  methods: {
    handleForm(flag) {
      this.formVisiable = flag
    },
    edit(index, data) {
      console.log(index, data)
    },
    del(index, data) {
      console.log(index, data)
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-wrapper {
  text-align: right;
}
</style>
