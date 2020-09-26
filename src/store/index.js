import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer_sortie:false,
    uid:"",
    recettes:[],
    personnes:[],
  },
  mutations: {
    setUid:(state,uid)=>{state.uid = uid;},
    toggle_drawer:state=>{
      state.drawer_sortie = !state.drawer_sortie},
    setRecettes:(state,recettes)=>{
      recettes.forEach(recette=>{
        let position = state.recettes.findIndex(recetteState=>recetteState.id==recette.id);
        if(position==-1){
          Vue.set(state.recettes,state.recettes.length,recette)
        }
        else{Vue.set(state.recettes,position,recette);}
      })
      },
    supprimerRecette:(state,recette)=>{
      state.recettes = state.recettes.filter(recetteStore=>recetteStore.id != recette.id);
    },  
    addRecette:(state,recette) => {state.recettes.push(recette);},
    addRecetteToPerson:(state,{id,recette})=>{
      let personne = state.personnes.find((personne)=>{return personne.id==id});
      if(personne){
        if(personne.recettes){
        let recetteDeja = personne.recettes.find((el)=>{return el.id==recette.id});
        if(recetteDeja){
          personne.recettes.splice(personne.recettes.indexOf(recetteDeja),1,recette);
        }
        else{
          personne.recettes.push(recette);}
        }
        else{personne.recettes = [recette];}
      }
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
    recettes(state){return state.recettes},
    getPerson(state){return (id)=>{return state.personnes.find((personne)=>{return personne.id===id;});}}
  },
  modules: {
  }
})
