<template>
  <div class="wordform-container">
    <el-dialog title="新增" :visible.sync="visiable" :close-on-click-modal="false" @close="close">
      <el-form close-on-click-modal="false" label-width="80px">
        <el-form-item 
          v-for="(field, i) in fields"
          :key="i"
          :label="field.label">
          <el-input v-if="field.prop !== 'examples'" size="mini" v-model="form[field.prop]"></el-input>
          <div v-else class="examples-wrapper">
            <el-button v-show="examplesLength === 0" type="primary" size="mini" icon="el-icon-plus" circle @click="add(j)"></el-button>
            <template v-for="(example, j) in form.examples">
              <div v-if="example.operate !== '3'" class="examples-item" :key="j">
                <el-input 
                  type="textarea"
                  resize="none"
                  rows="2"
                  size="mini"
                  v-model="example.en">
                </el-input>
                <span>翻译：</span>
                <el-input 
                  type="textarea"
                  resize="none"
                  rows="2"
                  size="mini"
                  class="example-zh"
                  v-model="example.zh">
                </el-input>
                <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="add(j)"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="del(j, example)"></el-button>
              </div>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="ok">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/serviceAPI.config.js'
export default {
  name: 'wordForm',
  props: {
    visiable: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: {
        word: '',
        mean: '',
        pronounce: '',
        examples: []
      }
    }
  },
  data() {
    return {
      fields: [
        {prop: 'word', label: '单词'},
        {prop: 'mean', label: '词意'},
        {prop: 'pronounce', label: '发音'},
        {prop: 'examples', label: '实例'}
      ],
      delExamples: []
    }
  },
  computed: {
    examplesLength() {
      let len = 0
      this.form.examples.forEach(item => {
        len += item.operate === '3' ? 0 : 1
      })
      return len
    }
  },
  methods: {
    add(index) {
      this.form.examples.splice(index + 1, 0, {en: '', zh: ''})
    },
    del(index, data) {
      this.form.examples.splice(index, 1)
      if (data.id) {
        data.operate = '3'
        delete data.origin
        this.delExamples.push(data)
      }
    },
    close() {
      this.$emit('wordForm', false, 'aaa')
    },
    cancel() {
      this.$emit('wordForm', false)
    },
    ok() {
      if (this.form.word.trim() === '') {
        this.$message.error('“单词”项必填')
        return
      }
      const origin = this.form.origin
      if (origin) { // 更新
        if (origin.word !== this.form.word.trim() || origin.mean != this.form.mean.trim()
          || origin.pronounce != this.form.pronounce .trim()) {
            this.form.operate = '1'
        }
        this.form.examples.forEach(item => {
          if (item.id && item.origin) {
            if (item.en.trim() != item.origin.en || item.zh.trim() != item.origin.zh) {
              item.operate = '1'
            }
          }
        })
        this.form.examples = this.form.examples.concat(this.delExamples)
      }
      this.$http.post(API.editWord, this.form).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.$emit('wordForm', false, true)
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  watch: {
    form() {
      this.delExamples = []
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.wordform-container {
  width: 80%;

  .examples-wrapper {
    text-align: left;
  }

  .examples-item {
    padding: 10px;
    border: 1px solid $color-blue;
    margin-bottom: 10px;
  }
}
</style>
