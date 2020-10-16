import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer_sortie:false,
    uid:"",
    mesRecettes:[],
    autresRecettes:[],
    personnes:[],
    color:"blue"
  },
  mutations: {
    setColor:(state,color)=>{state.color=(color || 'blue');},
    setUid:(state,uid)=>{state.uid = uid;},
    toggle_drawer:state=>{
      state.drawer_sortie = !state.drawer_sortie},
    setMesRecettes:(state,recettes)=>{
      recettes.forEach(recette=>{
        let position = state.mesRecettes.findIndex(recetteState=>recetteState.id==recette.id);
        if(position==-1){
          Vue.set(state.mesRecettes,state.mesRecettes.length,recette)
        }
        else{Vue.set(state.mesRecettes,position,recette);}
      })
    },
    supprimerMaRecette:(state,recette)=>{
      state.mesRecettes = state.mesRecettes.filter(recetteStore=>recetteStore.id != recette.id);
    },  
    setAutresRecettes:(state,recettes)=>{
      recettes.forEach(recette=>{
        if(!recette.cuisinier)
          return;
        let position = state.autresRecettes.findIndex(recetteState=>recetteState.id==recette.id);
        if(position==-1){
          Vue.set(state.autresRecettes,state.autresRecettes.length,recette)
        }
        else{Vue.set(state.autresRecettes,position,recette);}
      })
    },
    addModifyPerson:(state,person)=>{
      let personneDeja = state.personnes.find((personne)=>{return personne.id==person.id});
      if(personneDeja){
        state.personnes.splice(state.personnes.indexOf(personneDeja),1,person);
      }
      else{
        state.personnes.push(person);
      }
    },

  },
  actions: {
  },
  getters:{
    uid(state){return state.uid},
    recettes(state){return state.mesRecettes},
    color(state){return state.color},
    getPerson(state){return (id)=>{return state.personnes.find((personne)=>{return personne.id===id;});}}
  },
  modules: {
  }
})
