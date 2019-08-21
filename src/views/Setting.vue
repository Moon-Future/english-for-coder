<template>
  <div class="set-container">
    <Header></Header>
    <routet-view></routet-view>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  name: 'Setting',
  components: {
    Header
  },
  data() {
    return {
      tabs: [
        {name: '个人资料', path: '/setting/profile'},
        {name: '个人资料', path: '/setting/profile'},
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>