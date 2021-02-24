import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import 'firebase/auth';

Vue.config.productionTip = false


let auth = firebase.auth();


auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
let app;
auth.onAuthStateChanged((person)=>{
  console.log(person);
  
  if(!person && app){app.$store.commit("deconnecter");}
  if(!app){
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
    if(person){
      firebase.firestore().collection('users').doc(auth.currentUser.uid).get()
      .then(snap=>{
        let data = snap.data();
        app.$store.commit('setColor',data.color);
      });
      firebase.firestore().collection("compteur").doc("compteur")
      .get().then(snap=>{
        let data = snap.data();
        app.$store.commit('setCompteur',data.compte);
      })
    }
  }
  else{ if(person){
    firebase.firestore().collection('users').doc(auth.currentUser.uid).get()
    .then(snap=>{
      let data = snap.data();
      app.$store.commit('setColor',data.color);
    });
    firebase.firestore().collection("compteur").doc("compteur")
    .get().then(snap=>{
      let data = snap.data();
      app.$store.commit('setCompteur',data.compte);
    })
  }}
})
