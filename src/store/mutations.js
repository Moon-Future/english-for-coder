import * as types from './mutation-types'

const mutations = {
  [types.SET_KEYWORD](state, val) {
    state.keyWord = val
  },
  [types.SET_USERINFO](state, {userInfo, status}) {
    state.userInfo = userInfo
    state.loginStatus = status
  },
  [types.SET_LOGINVISIABLE](state, flag) {
    state.loginVisiable = flag
  },
  [types.SET_LOGINFLAG](state, flag) {
    state.loginFlag = flag
  }
}

export default mutations