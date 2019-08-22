<template>
  <div class="userwords-container">
    <div class="content">
      <words-table :params="params"></words-table>
    </div>
  </div>
</template>

<script>
import WordsTable from '@/components/WordsTable'
import { mapGetters } from 'vuex'
export default {
  name: 'userWords',
  components: {
    WordsTable
  },
  data() {
    return {
      params: {}
    }
  },
  created() {
    this.params = {userID: this.userInfo.id, admin: true}
  },
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 80%;
  margin: 20px auto 0;
}
</style>