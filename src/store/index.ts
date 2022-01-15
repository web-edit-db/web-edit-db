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
      pan: { x: 10, y: 10 },
      zoom: 1,
      tables: {}
    }
  },
  mutations,
  actions,
  getters
})
