<template>
  <div class="search-container">
    <div class="logo">
      <img alt="Vue logo" src="../assets/logo.png">
    </div>
    <div class="search-wrapper">
      <img alt="Vue logo" src="../assets/logo.png">
      <el-input class="search-inp" v-model="input" placeholder="请输入单词查询">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      input: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.search-container {
  margin-top: 20px;
  .logo img {
    width: 300px;
  }
  .search-wrapper {
    display: flex;
    justify-content: center;
    position: relative;
    img {
      height: 40px;
      margin-right: 20px;
      position: absolute;
      left: 12%;
      opacity: 0;
    }
    .search-inp {
      width: 40%;
    }
  }
}
</style>
