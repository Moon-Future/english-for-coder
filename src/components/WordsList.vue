<template>
  <div class="wordsls-container">
    <el-card shadow="hover" class="card-item">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
    </el-card>
    <el-card shadow="hover" class="card-item">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
    </el-card>
    <el-card shadow="hover" class="card-item">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
    </el-card>
    <el-card shadow="hover" class="card-item">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
    </el-card>
    <el-card shadow="hover" class="card-item">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
    </el-card>
    <el-card shadow="hover" class="card-item">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
    </el-card>
    <el-card shadow="hover" class="card-item">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
    </el-card>
    <el-card shadow="hover" class="card-item">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
    </el-card>
    <el-card shadow="hover" class="card-item">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'WordsList',
  data() {
    return {
      tableData: [{
        id: '111',
        name: 'product',
        desce: 'xxx'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
  .wordsls-container {
    margin-top: 50px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .card-item {
      width: 30%;
      margin: 10px;
    }
  }
</style>
