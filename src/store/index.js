import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users:[],
    drawer_sortie:false
  },
  mutations: {
    setUsers:(state,users)=>{state.users = users;},
    toggle_drawer:state=>{
      state.drawer_sortie = !state.drawer_sortie}
  },
  actions: {
  },
  getters:{
    users(){}
  },
  modules: {
  }
})
