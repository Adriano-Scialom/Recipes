<template>
  <div>
    <v-container class="mt-5">
      <v-layout row justify-space-around>
        <v-flex xs10 md8>
          <v-card v-if='profil'>
            <v-card-title>Profil</v-card-title>
            <v-card-text>
              <v-text-field @keydown="nomChange=true" dense v-model="profil.nom" :rules="[(v)=>v.length>2 || 'Nom trop court',(v)=>/^[a-zA-Z-'\s]{3,}$/.test(v)|| 'Nom non valide']" outlined label="Nom"></v-text-field>
              <v-text-field @keydown="nomChange=true" dense v-model="profil.prenom" :rules="[(v)=>v.length>2 || 'Prénom trop court',(v)=>/^[a-zA-Z-'\s]{3,}$/.test(v)|| 'Prénom non valide']" outlined label="Prenom"></v-text-field>
              <div class="text-center pa-0 ma-0"><v-btn :disabled="!nomChange" class="text-subtitle-1" text :color="color">Valider</v-btn></div>
              <v-select :loading='changementCouleur' item-text="nom" item-value="color" v-model="color"  :items="couleurs" label="Couleur du site" 
                  :menu-props='{closeOnClick: true,closeOnContentClick: true,disableKeys:true,openOnClick: false,maxHeight:304,"offset-y":true}' ></v-select>
              <v-divider class="mb-3"></v-divider>
              <v-hover v-slot:default="{hover}">
                <v-img v-if="profil.imageURL" :src="profil.imageURL" contain max-height=200>
                  <v-overlay absolute v-if="hover"><v-btn @click="supprimerPhoto" icon big><v-icon>delete</v-icon></v-btn></v-overlay>
                </v-img>
              </v-hover>
              
            </v-card-text>
            <v-card-actions>
              <input hidden type="file" v-on:change="ajouterPhoto" ref="inputAjoutPhoto" accept="image/*">
              <v-btn @click="ouvrirInput" text  :color='color'><span v-if="!profil.imageURL">Ajouter photo de profil</span><span v-else>Remplacer photo de profil</span><v-icon small right>add_a_photo</v-icon></v-btn>
            </v-card-actions>
          </v-card>
          
        </v-flex>
      </v-layout>
      <v-layout row justify-space-around>
        <v-flex xs12 md6 class="mt-5">
          <div class="text-center"><v-btn color="red lighten-1" @click="deconnection" class="text-h6" text>Se deconnecter</v-btn></div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import all from "../fb";
import firebase from 'firebase/app';
import 'firebase/storage';
const auth = all.auth;
const db = all.db;
import {compression} from '../outils';
export default {
  data() {
    return {
      profil:null,
      nomChange:false,
      file:null,
      couleurs: [
        {nom:'Ambre',color:'amber'},{nom:'Orange',color:'orange'},{nom:'Rouge',color:'red'},
        {nom:'Rose',color:'pink'},{nom:'Violet',color:'purple'},{nom:'Violet foncé',color:'deep-purple'},
        {nom:"Bleu",color:'blue'},{nom:'Indigo',color:'indigo'},{nom:'Anthracite',color:'blue-grey'},
        {nom:'Vert clair',color:'light-green'},{nom:"Vert",color:'green'},
        {nom:'Marron',color:'brown'},
        ],
      changementCouleur:false,
    }
  },

  methods: {
    deconnection(){auth.signOut().then(()=>{this.$router.replace('/connexion')})},
    supprimerPhoto(){
      let ref = firebase.storage().refFromURL(this.profil.imageURL)
      ref.delete()
      this.profil.imageURL = null;
      db.collection("users").doc(auth.currentUser.uid).update({imageURL:null});
    },
    ouvrirInput(){
      let input = this.$refs.inputAjoutPhoto;
      input.click();
    },
    ajouterPhoto(e){
      let fichier = e.target.files[0];
      compression(fichier,this.envoyerPhoto);
    },
    envoyerPhoto(file){
      let nomFichierDecoupe = file.name.split('.')
      let ref = firebase.storage().ref(auth.currentUser.uid+"/photoProfil."+nomFichierDecoupe[nomFichierDecoupe.length-1]);
      
      ref.put(file)
      .then(()=>{
        ref.getDownloadURL().then(url=>{
          this.profil.imageURL = url;
          
          //this.$forceUpdate();
          db.collection("users").doc(auth.currentUser.uid)
          .update({imageURL:url});
          })  
        })
    },
    
  },
  computed: {
    color:{
    get:function(){return this.$store.getters.color},
    set:function(newValue){
      this.changementCouleur = true;
      db.collection("users").doc(auth.currentUser.uid).update({'color':newValue})
      .then(()=>{this.$store.commit("setColor",newValue);
      this.changementCouleur = false;
        }
      )
    }
    }
  },
  created() {
    db.collection("users")
    .doc(auth.currentUser.uid)
    .get()
    .then((donnees) => {
      let personne = donnees.data();
      personne.id = donnees.id;
      this.profil = personne
    });
  },
};
</script>

<style scoped>
</style>