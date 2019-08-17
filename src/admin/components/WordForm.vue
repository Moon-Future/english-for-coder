<template>
  <div class="wordform-container">
    <el-dialog title="新增" :visible.sync="visiable" :close-on-click-modal="false" @close="close">
      <el-form close-on-click-modal="false" label-width="80px">
        <el-form-item 
          v-for="(field, i) in fields"
          :key="i"
          :prop="field.prop"
          :label="field.label">
          <el-input v-if="field.prop !== 'examples'" size="mini" v-model="form[field.prop]"></el-input>
          <div v-else>
            <template v-for="(example, j) in form.examples">
              <div class="examples-item" :key="j">
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
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="del(j)"></el-button>
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
    }
  },
  data() {
    return {
      fields: [
        {prop: 'word', label: '单词'},
        {prop: 'mean', label: '意思'},
        {prop: 'pronounce', label: '发音'},
        {prop: 'examples', label: '例子'}
      ],
      form: {
        word: '',
        mean: '',
        pronounce: '',
        examples: [{en: '', zh: ''}]
      }
    }
  },
  methods: {
    add(index) {
      this.form.examples.splice(index + 1, 0, {en: '', zh: ''})
    },
    del(index) {
      this.form.examples.splice(index, 1)
      if (this.form.examples.length === 0) {
        this.form.examples.push({en: '', zh: ''})
      }
    },
    close() {
      this.$emit('wordForm', false)
    },
    cancel() {
      this.$emit('wordForm', false)
    },
    ok() {
      // this.$emit('wordForm', false)
      console.log(this.form)
      // return
      this.$http.post(API.editWord, this.form).then(res => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/css/variable.scss';
.wordform-container {
  width: 80%;

  .examples-item {
    text-align: left;
    padding: 10px;
    border: 1px solid $color-blue;
    margin-bottom: 10px;
  }
}
</style>
