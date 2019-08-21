<template>
  <div class="menu-container">
    <el-menu
      default-active="1"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1">
        <i class="el-icon-collection"></i>
        <span slot="title">词汇</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'navMenu'
}
</script>

<style lang="scss" scoped>
  .menu-container {
    width: 200px;
    text-align: left;
    position: fixed;
    top: 50px;
    bottom: 0;
    background: #545c64;

    .el-menu {
      border-right: none;
    }
  }
</style>
