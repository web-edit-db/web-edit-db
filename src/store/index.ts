import { createStore } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { State } from './types'

export default createStore<State>({
  state: {
    name: undefined,
    handle: undefined,
    database: undefined,
    tables: {},
    modifications: {}
  },
  mutations,
  actions,
  getters
})
