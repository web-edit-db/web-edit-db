import { createStore } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { State } from './types'

export default createStore<State>({
  state: {
    sqljs: null,
    database: null,
    tables: {},
    modifications: {}
  },
  mutations,
  actions,
  getters
})
