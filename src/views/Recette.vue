<template>
  <div class="contain">
    <v-overlay v-if="imageZoomUrl">
      <v-spacer></v-spacer>
      <div class="text-align-top text-right"><v-btn @click="imageZoomUrl=null" icon color="white"><v-icon>close_fullscreen</v-icon></v-btn></div>
      <v-spacer></v-spacer>
      <div class="text-center text-align-center">
          <v-img :src="imageZoomUrl" aspect-ratio="1" width=600 height=600 contain></v-img>
      </div>
    </v-overlay>
    <div class="gauche">
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card v-if="recette.quantite">
              <v-card-title>
                <div>Nombre de personnes : {{quantite}}</div>
              </v-card-title>
              <v-card-actions>
                
                <v-layout class="mx-1" row >
                  <v-flex xs1 class="pt-1 text-center">1</v-flex>
                  <v-flex xs10><v-slider ticks="always" v-model="quantite" min="1" max="12"></v-slider></v-flex>
                  <v-flex xs1 class="pt-1 text-center">12</v-flex>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row class="mt-5">
          <v-flex xs12>
            <v-card>
              <v-card-title>Informations complémentaires</v-card-title>
              <v-card-text>
                <v-switch v-if="appartient" @change="enregistrerModificationRecette('public')" v-model="recette.public" label="Recette publique"></v-switch>
                <v-layout row class="ml-0 text-body-1" v-if="!appartient">
                  <v-flex xs5>
                    Note du cuisinier
                  </v-flex>
                  <v-flex xs7 class="text-right pr-2">
                   <v-rating readonly v-model="noteCuisinier" half-increments hover dense></v-rating>
                  </v-flex>
                </v-layout>
                <v-layout row class="ml-0 text-body-1">
                  <v-flex xs5>
                    Ma note
                  </v-flex>
                  <v-flex xs7 class="text-right pr-2">
                    <v-rating v-model="maNote"  half-increments hover dense></v-rating>
                  </v-flex>
                </v-layout>
                <v-layout row class="ml-0 text-body-1">
                  <v-flex xs5>
                    Note moyenne
                  </v-flex>
                  <v-flex xs7 class="text-right pr-2">
                   <v-rating readonly v-model="noteMoyenne" half-increments hover dense></v-rating>
                  </v-flex>
                </v-layout>
                <v-select v-model="recette.categorie" :items="categories.map(categorie=>categorie.nom)" @change="()=>{enregistrerModificationRecette('categorie')}"  label="Catégories" 
                  :menu-props='{closeOnClick: true,closeOnContentClick: true,disableKeys:true,openOnClick: false,maxHeight:304,"offset-y":true}'></v-select>  
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row class="mt-5">
          <v-flex xs12>
            <v-card>
              <v-card-title>Photos</v-card-title>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs6 md4 v-for="image in recette.images" :key="image.url">
                    <v-hover>
                      <template v-slot:default="{hover}">
                        <v-img class="ma-1" :src="image.url" aspect-ratio="1">
                          <v-overlay v-if="hover" absolute z-index=1>
                            <v-btn icon color="white" @click="imageZoomUrl=image.url"><v-icon>zoom_in</v-icon></v-btn>
                          </v-overlay>
                          <div class="text-right text-align-top" v-if="hover && appartient"><v-btn @click="()=>{supprimerImage(image)}" style="z-index:3;" color="white" small icon><v-icon>delete</v-icon></v-btn></div>
                        </v-img>
                      </template>
                    </v-hover>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <input hidden type="file" v-on:change="inputChange" ref="inputAjoutPhoto" accept="image/*">
                
                <v-btn text v-if="appartient" color="blue" @click="ajoutPhoto">Ajouter photo <v-icon right>add_a_photo</v-icon></v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>

    <div class="droite">
      <v-container>
        <v-layout row justify-space-around>
          <v-flex>
            <v-card class="mb-5">
              <h2 class="blue--text text-center text-capitalize">{{recette.titre}}</h2>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row justify-space-around>
          <v-flex xs12>
            <v-card class="mb-2">
              <h2 class="ml-3 blue--text ">Ingrédients</h2>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row class="mt-2" justify-space-around>
          <v-flex xs12>
            <v-card>
              <v-list>
                <v-list-item v-for="ingredient in recette.ingredients" :key="ingredient.nom">
                  <v-list-item-content>
                    <div class="text-body-1 blue--text text--darken-3">
                      <span v-if="ingredient.qte && ingredient.qte>0">
                        {{Math.round(100*ingredient.qte*quantite/recette.quantite)/100}} {{ingredient.unite}}
                        <span
                          v-if="ingredient.unite"
                        >de </span>
                      </span>
                      <span class="text-capitalize">{{ingredient.nom}}</span>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row class="mt-5" justify-space-around>
          <v-flex xs12>
            <v-card class="mb-2">
              <h2 class="ml-2 blue--text text--lighten-1">Etapes</h2>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row class="mt-2" justify-space-around>
          <v-flex xs12>
            <v-card>
              <v-list>
                <v-list-item v-for="etape in recette.etapes" :key="etape.nom">
                  <v-list-item-content>
                    <div class="text-body-1 blue--text text--darken-3">{{etape.texte}}</div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row justify-space-around>
          <v-flex xs12 class="mt-5">
            <div class="text-center">
              <v-btn
                v-if="appartient"
                text
                @click="modifier"
                class="info--text text-h6"
              >Modifier recette</v-btn>
              <v-btn
                v-if="!appartient"
                text
                @click="copier"
                class="info--text text-subtitle-1 font-weight-medium"
              >Copier Recette sur espace personnel</v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
div.contain {
  display: grid;
  grid-template-columns: 400px auto;
  grid-template-rows: 1fr;
  align-items: stretch;
  justify-items: stretch;
  height: 100%;
  margin-top: 10px;
}
div.gauche {
  grid-column: 1/2;
  grid-row: 1/2;
  padding: 10px;
}
div.droite {
  grid-column: 2/3;
  grid-row: 1/2;
  padding: 10px;
}
</style>

<script>
import all from "../fb";
const auth = all.auth;
const db = all.db;
import firebase, { storage } from 'firebase/app';
import 'firebase/storage';
import {compression,categories} from '../outils';

export default {
  data() {
    return {
      recette: {},
      quantite: 0,
      imageZoomUrl:null,
      categories:categories
    };
  },
  computed:{
    appartient(){return this.$route.name=='Recette'},
    noteMoyenne(){
      if(!this.recette.notes || this.recette.notes.length==0){return 0}
      else{
        let notes = this.recette.notes.map(note=>note.valeur);
        return notes.reduce((previous, current) => current += previous)/notes.length;
      }
    },
    maNote:{
      get:function(){
      if(!this.recette.notes || this.recette.notes.length==0){return 0}
      else{return this.recette.notes.find(note=>note.id==auth.currentUser.uid).valeur;}
      },
      set:function(newValue){
        console.log(newValue);
        if (!this.recette.notes){this.$set(this.recette,'notes',[{valeur:newValue,id:auth.currentUser.uid}]);return;} 
        if(!this.recette.notes.find(note=>note.id==auth.currentUser.uid)){
          this.$set(this.recette.notes,this.recette.notes.length,{valeur:newValue,id:auth.currentUser.uid});
          return;
        }
        this.$set(this.recette.notes,this.recette.notes.findIndex(note=>note.id==auth.currentUser.uid),{valeur:newValue,id:auth.currentUser.uid});
        this.enregistrerModificationRecette('notes');
      }
    },
    noteCuisinier(){
      if(!this.recette.notes || this.recette.notes.length==0){return 0}
      if(this.appartient){return this.maNote;}
      let note = this.recette.notes.find(note=>note.id==this.$route.params.idpersonne);
      return note.valeur;
    }
  },
  methods: {
    modifier() {
      this.$router.push("/modifier/" + this.recette.id);
    },
    changerNote(){
      console.log(event);
    },
    copier() {
      if (this.$route.params.idpersonne != auth.currentUser.uid) {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .collection("recettes")
          .add(this.recette)
          .then((snap) => {
            this.$router.push("/recette/" + snap.id);
          });
      }
    },
    supprimerImage(image){
      this.recette.images.splice(this.recette.images.indexOf(image),1);
      this.enregistrerModificationRecette('images');
      storage().refFromURL(image.url).delete();
    },
    ajoutPhoto(){
      let input = this.$refs.inputAjoutPhoto;
      input.click();
    },
    inputChange(e){
      let fichier = e.target.files[0];
      compression(fichier,this.enregistrerImage);
    },
    enregistrerImage(fichier){
      let nomFichier = fichier.name.split(".")[0]+new Date().getTime().toString()+"."+fichier.name.split(".")[1];
      let ref = firebase.storage().ref(auth.currentUser.uid+"/"+this.recette.id+"/"+nomFichier);
      ref.put(fichier)
      .then((data)=>{
        console.log(data);
        ref.getDownloadURL().then(url=>{
          if(this.recette.images){this.recette.images.push({url:url})}
        else{this.recette.images = [{url:url}]}
        this.$forceUpdate();
        db.collection("users").doc(auth.currentUser.uid)
        .collection("recettes").doc(this.recette.id)
        .update({images:this.recette.images});
        })  
        })   
      },
      enregistrerModificationRecette(field){
        console.log('field',field);
        let dbdoc = db.collection("users").doc(auth.currentUser.uid)
        .collection("recettes").doc(this.recette.id)
        if(field){
          let obj = {};
          obj[field] = this.recette[field];
          dbdoc.update(obj)}
        else{dbdoc.set(this.recette)}
      }
  },

  created() {
    if (this.appartient) {
      let id = this.$route.params.id;
      let recettes = this.$store.state.recettes;
      if (recettes.length == 0) {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .collection("recettes")
          .doc(id)
          .get()
          .then((data) => {
            this.recette = data.data();
            this.recette.id = id;
            this.quantite = this.recette.quantite;
            this.$store.commit("addRecette", this.recette);
          })
          .catch(() => {
            this.$router.replace("/mesrecettes");
          });
      } else {
        recettes.forEach((recette) => {
          if (recette.id === id) {
            this.recette = recette;
            this.quantite = recette.quantite;
          }
        });
        if (!this.recette.etapes) {
          this.$router.replace("/mesrecettes");
        }
      }
    } else {
      let params = this.$route.params;
      let personne = this.$store.state.personnes.filter((personne) => {
        return personne.id == params.idpersonne;
      })[0];
      if (personne) {
        let recette = personne.recettes.filter((recette) => {
          return recette.id === params.idrecette;
        })[0];
        if (recette) {
          recette.id = params.idrecette;
          this.recette = recette;
          this.recette.quantite = this.recette.quantite || 4;
          this.quantite = this.recette.quantite;
        }
      }
      if (!this.recette.titre) {
        db.collection("users")
          .doc(params.idpersonne)
          .collection("recettes")
          .doc(params.idrecette)
          .get()
          .then((res) => {
            let recette = res.data();
            recette.id = res.id;
            this.recette = recette;
            this.recette.quantite = this.recette.quantite || 4;
            this.quantite = recette.quantite;
          });
      }
    }
  },
  
};
</script>