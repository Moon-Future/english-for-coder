<template>
  <div class="words-container">
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
    </el-table>
  </div>
</template>

<script>
import API from '@/serviceAPI.config.js'
export default {
  name: 'words',
  components: {
    
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
      ]
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

  }
}
</script>

<style lang="scss" scoped>

</style>
