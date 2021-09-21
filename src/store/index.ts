import { createStore } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { State } from './types'

export default createStore<State>({
  state: {
    sqlJs: null,
    database: null,
    tables: {},
    modifications: {},
    graph: {}
  },
  mutations,
  actions,
  getters
})
