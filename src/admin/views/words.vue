<template>
  <div class="words-container">
    <div class="btn-wrapper">
      <el-button type="primary" size="mini" @click="add">新增</el-button>
    </div>
    <el-table
      :data="wordsList"
      stripe
      size="mini"
      style="width: 100%">
       <el-table-column type="expand">
          <template slot-scope="props">
            <div v-for="(example, i) in props.row.examples" :key="example.id" class="examples-item">
              <p>{{ i + 1 }}. {{ example.en }}</p>
              <span>{{ example.zh }}</span>
            </div>
            <div v-if="props.row.examples.length === 0">
              <p>暂无实例</p>
            </div>
          </template>
        </el-table-column>
      <el-table-column
        v-for="(field, i) in fields"
        :key="i"
        :prop="field.prop"
        :label="field.label">
        <template slot-scope="scope">
          <span v-if="field.prop !== 'verify'">{{ scope.row[field.prop] }}</span>
          <el-button v-else size="mini" :type="scope.row[field.prop] === 1 ? 'success' : 'info'" @click="changeVerigy(scope.row)">
            {{ scope.row[field.prop] === 1 ? '已审核' : '未审核' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <word-form :visiable="formVisiable" :admin="true" :form="form" @wordForm="handleForm"></word-form>
  </div>
</template>

<script>
import WordForm from '@/admin/components/WordForm'
import { deepClone } from '@/common/js/util.js'
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
        {prop: 'mean', label: '词意'},
        {prop: 'pronounce', label: '发音'},
        {prop: 'counter', label: '热度'},
        {prop: 'verify', label: '状态'}
      ],
      formVisiable: false,
      form: {
        word: '',
        mean: '',
        pronounce: '',
        examples: []
      },
      admin: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http.get(API.wordsList, {
        params: {letter: 'all', admin: true}
      }).then(res => {
        this.wordsList = res.data.data
      })
    },
    handleForm(flag, refresh) {
      this.formVisiable = flag
      if (refresh) {
        this.getData()
      }
    },
    add() {
      this.formVisiable = true
      this.form = {
        word: '',
        mean: '',
        pronounce: '',
        examples: []
      }
    },
    edit(index, data) {
      delete data.origin
      this.form = deepClone(data)
      this.form.origin = deepClone(this.form) // 更新比较
      delete this.form.origin.examples
      this.form.examples.forEach(item => {
        delete item.origin
        item.origin = deepClone(item)
      })
      this.formVisiable = true
    },
    del(index, data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        data.operate = '3'
        this.$http.post(API.editWord, data).then(res => {
          if (res.data.code === 1) {
            this.wordsList.splice(index, 1)
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除')          
      });
    },
    changeVerigy(data) {
      this.$confirm('改变审核状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let verify = data.verify === 1 ? 0 : 1
        this.$http.post(API.changeVerify, {
          id: data.id, verify: verify
        }).then(res => {
          if (res.data.code === 1) {
            this.$message.success(res.data.message)
            data.verify = verify
          } else {
            this.$message.error(res.data.message)
          }
        })
      }).catch(() => {
        this.$message.info('已取消')          
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.btn-wrapper {
  text-align: right;
}

.examples-item {
  text-align: left;
  p {
    font-size: 16px;
    padding: 10px 0;
  }
  span {
    color: $color-gray;
    font-size: 14px;
  }
}
</style>
