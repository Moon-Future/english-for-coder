<template>
  <div class="words-container">
    <words-table :params="params"></words-table>
  </div>
</template>

<script>
import WordsTable from '@/components/WordsTable'
import { deepClone } from '@/common/js/util.js'
import API from '@/serviceAPI.config.js'
export default {
  name: 'words',
  components: {
    WordsTable
  },
  data() {
    return {
      params: {
        letter: 'all',
        admin: true
      }
    }
  },
  created() {

  },
  methods: {
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

</style>
