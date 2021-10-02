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
    graph: {
      pan: { x: 16, y: 16 },
      zoom: 1,
      tables: {}
    }
  },
  mutations,
  actions,
  getters
})
