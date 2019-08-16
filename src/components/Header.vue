<template>
  <div class="header-container">
    <p>我的</p>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.header-container {
  border-bottom: 1px solid $color-shallowgray;
  height: 50px;
  line-height: 50px;
}
</style>
