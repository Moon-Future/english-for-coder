module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8887/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
     },
  },
}