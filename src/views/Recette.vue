<template>
  <div class="contain">
    <v-overlay v-if="imageZoomUrl">
      <v-spacer></v-spacer>
      <div class="text-align-top text-right"><v-btn @click="imageZoomUrl=null" icon color="white"><v-icon>close_fullscreen</v-icon></v-btn></div>
      <v-spacer></v-spacer>
      <div class="text-center text-align-center overlay">
          <v-img :src="imageZoomUrl" aspect-ratio="1"  contain></v-img>
      </div>
    </v-overlay>
    <v-snackbar top color="green" v-model="successUpdate">La recette a bien été ajoutée</v-snackbar>
    <v-snackbar top color="red" v-model="failureUpdate">Il y a eu une erreur dans l'ajout de la recette</v-snackbar>
    <div class="gauche">
      <v-container class="px-5">
        <v-layout row wrap>
          <v-flex xs12>
            <v-card v-if="recette.quantite">
              <v-card-title>
                <div>Nombre de personnes : {{quantite}}</div>
              </v-card-title>
              <v-card-actions>
                
                <v-layout class="mx-1" row >
                  <v-flex xs1 class="pt-1 text-center">1</v-flex>
                  <v-flex xs10><v-slider :color="color" ticks="always" v-model="quantite" min="1" max="12"></v-slider></v-flex>
                  <v-flex xs1 class="pt-1 text-center">12</v-flex>
                </v-layout>
                
              </v-card-actions>
              <v-layout class='pb-2' justify-space-around><v-btn class="text-center" text :color="color" @click="()=>{updateListe({id:recette.id,nombre:quantite,cuisinier: appartient ? auth.currentUser.uid : $route.params.idpersonne}).then(()=>{successUpdate=true}).catch(()=>{failureUpdate=true;})}">Ajouter recette à liste</v-btn></v-layout>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row class="mt-3">
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
                   <v-rating :color="color" readonly v-model="noteCuisinier" half-increments hover dense></v-rating>
                  </v-flex>
                </v-layout>
                <v-layout row class="ml-0 text-body-1">
                  <v-flex xs5>
                    Ma note
                  </v-flex>
                  <v-flex xs7 class="text-right pr-2">
                    <v-rating :color="color" v-model="maNote" half-increments hover dense></v-rating>
                  </v-flex>
                </v-layout>
                <v-layout row class="ml-0 text-body-1">
                  <v-flex xs5>
                    Note moyenne
                  </v-flex>
                  <v-flex xs7 class="text-right pr-2">
                   <v-rating :color="color" readonly v-model="noteMoyenne" half-increments hover dense></v-rating>
                  </v-flex>
                </v-layout>
                <v-select v-model="recette.categorie" :readonly="!appartient" :items="categories.map(categorie=>categorie.nom)" @change="()=>{enregistrerModificationRecette('categorie')}"  label="Catégories" 
                  :menu-props='{closeOnClick: true,closeOnContentClick: true,disableKeys:true,openOnClick: false,maxHeight:304,"offset-y":true}' ></v-select>  
                <v-layout >
                  <v-flex v-if="recette.dureePreparation" xs6>
                    Durée de préparation :<div>{{recette.dureePreparation}}min</div>
                  </v-flex>
                  <v-flex v-if="recette.dureeCuisson" xs6>
                    Durée de cuisson :<div>{{recette.dureeCuisson}}min</div>
                  </v-flex>
                </v-layout>
              
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row class="mt-3">
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
                          <div class="text-right text-align-top" v-if="hover && (appartient || image.photographe == auth.currentUser.uid)"><v-btn @click="()=>{supprimerImage(image)}" style="z-index:3;" color="white" small icon><v-icon>delete</v-icon></v-btn></div>
                        </v-img>
                      </template>
                    </v-hover>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <input hidden type="file" v-on:change="inputChange" ref="inputAjoutPhoto" accept="image/*">
                <v-btn text :color="color" @click="ajoutPhoto">Ajouter photo <v-icon right>add_a_photo</v-icon></v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div class="titre">
      <v-container class="px-5 pb-1">
        <v-layout row justify-space-around>
          <v-flex xs12>
            <v-card>
              <v-card-title :class="[color+'--text','py-1','text-h6','text-md-h4','text-center']"><span class="text-center">{{recette.titre}}</span></v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div class="droite">
      <v-container class="px-5">
        <v-layout row justify-space-around>
          <v-flex xs12>
            <v-card>
              <v-card-title :class="['ml-2','text-h5',color+'--text']">Ingrédients</v-card-title>
              <v-divider></v-divider>
              <v-list>
                <v-list-item  v-for="ingredient in recette.ingredients" :key="ingredient.id">
                  <v-list-item-title class="">
                    <div :class="['py-0','text-body-1',color+'--text','text--darken-3']">
                      <span v-if="ingredient.qte && ingredient.qte>0">
                        {{Math.round(100*ingredient.qte*quantite/recette.quantite)/100}} {{ingredient.unite}}
                        <span
                          v-if="ingredient.unite"
                        >{{'aeiouh'.includes(ingredient.nom[0].toLowerCase()) ? " d'": ' de '}}</span>
                      </span>
                      <span class="text-capitalize">{{ingredient.nom}}</span>
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row class="mt-3" justify-space-around>
          <v-flex xs12>
            <v-card>
              <v-card-title :class="['ml-2','text-h5',color+'--text']">Etapes</v-card-title>
              <v-divider></v-divider>
              <v-list>
                <v-list-item v-for="etape in recette.etapes" :key="etape.id">
                  <v-list-item-content>
                    <div :class="['text-body-1',color+'--text','text--darken-3']">{{etape.texte}}</div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row class="mt-3" justify-space-around>
          <v-flex xs12>
            <v-card>
              <v-card-title :class="['ml-2','text-h5',color+'--text']">Commentaires</v-card-title>
              <v-divider></v-divider>
              <v-list>
                <v-list-item v-for="commentaire in recette.commentaires" :key="commentaire.texte">
                  <v-list-item-icon class="mr-3"><v-avatar v-if="commentaire.imageURL"><v-img :src="commentaire.imageURL"></v-img></v-avatar></v-list-item-icon>
                  <v-list-item-content>
                    <v-layout class="mx-0" row justify-space-between>
                    <v-flex xs4 md2 class="text-body-2 text-md-body-1 pr-1">{{commentaire.prenom}} </v-flex>
                    <v-flex xs7 md9>
                    <span :class="['text-body-2','text-md-body-1',color+'--text','text--darken-3']">{{commentaire.texte}}</span>
                    </v-flex>
                    <v-flex xs1><v-btn v-if="commentaire.uid && commentaire.uid == auth.currentUser.uid" icon @click="()=>supprimerCommentaire(commentaire)"><v-icon>delete</v-icon></v-btn></v-flex>
                    </v-layout>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item><v-text-field v-model="monCommentaire" placeholder="Mon commentaire"></v-text-field>
                <v-btn icon right :color="color" :disabled="!envoieCommentaireEnabled" @click="envoyerCommentaire"><v-icon>send</v-icon></v-btn>
                </v-list-item>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout class="mt-3" row justify-space-around>
          <v-flex xs12>
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
.v-list-item{
  min-height: 32px;
}
div.contain {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto auto;
  height: 90%;
  margin-top: 5px;
}
div.titre{
  grid-column: 1/2;
  grid-row: 1/2;
  padding: 5px;
  padding-bottom: 0px;
}
div.gauche {
  grid-column: 1/2;
  grid-row: 2/3;
  padding: 5px;
  padding-bottom:0px;
}
div.droite {
  grid-column: 1/2;
  grid-row: 3/4;
  padding: 5px;
  padding-top:0px;
}
.overlay{
  width:min(75vw,75vh,600px);
  aspect-ratio: 1/1;
}
@media screen and (min-width:700px) {
  div.contain {
  display: grid;
  grid-template-columns: min(400px,50%) auto;
  grid-template-rows: auto 1fr;
  align-items: stretch;
  justify-items: stretch;
  height: 100%;
  margin-top: 10px;
}
div.gauche {
  grid-column: 1/2;
  grid-row: 1/3;
  padding: 10px;
}
div.droite {
  grid-column: 2/3;
  grid-row: 2/3;
  padding: 2px 10px;
}
div.titre{
  grid-column: 2/3;
  grid-row: 1/2;
  padding: 10px 10px 0px 10px;
}
}
</style>

<script>
import all from "../fb";
const auth = all.auth;
const db = all.db;
import firebase, { storage } from 'firebase/app';
import 'firebase/storage';
import {compression,categories} from '../outils';
import "firebase/functions";
const updateListe = firebase.app().functions('europe-west1').httpsCallable("updateListe");
let funct = firebase.app().functions('europe-west1')
//funct.useFunctionsEmulator("http://localhost:5000");
const mail = funct.httpsCallable("mail");

export default {
  data() {
    return {
      recette: {},
      monCommentaire:"",
      envoieCommentaireEnabled:true,
      quantite: 0,
      imageZoomUrl:null,
      categories:categories,
      updateListe,
      successUpdate:false,
      failureUpdate:false,
      auth,
    }
  },
  computed:{
    color(){return this.$store.getters.color},
    appartient(){return this.$route.name=='Recette'},
    uid_recette(){if(this.appartient) return auth.currentUser.uid; else return this.$route.params.idpersonne},
    noteMoyenne(){
      if(!this.recette.notes || this.recette.notes.length==0){return 0}
      else{
        return this.recette.notes.reduce((previous, current) => current.valeur + previous,0)/this.recette.notes.length;
      }
    },
    maNote:{
      get:function(){
      if(!this.recette.notes || this.recette.notes.length==0){return 0}
      else{let note =  this.recette.notes.find(note=>note.id==auth.currentUser.uid);
      if(note)
      return note.valeur;
      else
      return 0;}
      },
      set:function(newValue){
        
        if (!this.recette.notes){this.$set(this.recette,'notes',[{valeur:newValue,id:auth.currentUser.uid}]);} 
        else
        if(!this.recette.notes.find(note=>note.id==auth.currentUser.uid)){
          this.$set(this.recette.notes,this.recette.notes.length,{valeur:newValue,id:auth.currentUser.uid});
          
        }
        else
        this.$set(this.recette.notes,this.recette.notes.findIndex(note=>note.id==auth.currentUser.uid),{valeur:newValue,id:auth.currentUser.uid});
        this.enregistrerModificationRecette('notes');
        this.changerNoteMoyenne();
      }
    },
    noteCuisinier(){
      if(!this.recette.notes || this.recette.notes.length==0){return 0}
      if(this.appartient){return this.maNote;}
      let note = this.recette.notes.find(note=>note.id==this.$route.params.idpersonne);
      return note ? note.valeur:0;
    }
  },
  watch:{
    //'noteMoyenne':'moyenne'
  },
  methods: {
    modifier() {
      this.$router.push("/modifier/" + this.recette.id);
    },
    changerNoteMoyenne(){
      let dbdoc = db.collection("users").doc(this.uid_recette)
        .collection("recettes").doc(this.recette.id)
      dbdoc.update({noteMoyenne:this.noteMoyenne}) 
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
    supprimerCommentaire(commentaire){
      this.recette.commentaires.splice(this.recette.commentaires.indexOf(commentaire),1);
      this.enregistrerModificationRecette('commentaires');
    },
    envoyerCommentaire(){
      this.envoieCommentaireEnabled = false;
      setTimeout(()=>{this.envoieCommentaireEnabled=true},6000);
      
      db.collection("users").doc(auth.currentUser.uid)
      .get().then(data=>{
        let prenom = data.data().prenom;
        let imageURL = data.data().imageURL;
        let commentaire = {texte:this.monCommentaire,prenom,imageURL,uid:auth.currentUser.uid};
        if (this.recette.commentaires){this.$set(this.recette.commentaires,this.recette.commentaires.length,commentaire);}
        else{this.recette.commentaires=[commentaire];}
        this.enregistrerModificationRecette("commentaires");
        
        if(!this.appartient)
            mail({commentateur:prenom,nom_cuisinier:this.recette.prenom,id_cuisinier:this.recette.cuisinier,id_recette:this.recette.id,nom_recette:this.recette.titre})
        this.envoieCommentaireEnabled = true;
        this.monCommentaire = "";
      })
      
    },
    ajoutPhoto(){
      let input = this.$refs.inputAjoutPhoto;
      input.click();
    },
    inputChange(e){
      let fichier = e.target.files[0];
      console.log(fichier);
      compression(fichier,this.enregistrerImage);
    },
    enregistrerImage(fichier){
      let nomFichier = fichier.name.split(".")[0]+new Date().getTime().toString()+"."+fichier.name.split(".")[1];
      let ref = firebase.storage().ref(this.uid_recette+"/"+this.recette.id+"/"+nomFichier);
      ref.put(fichier)
      .then(()=>{
        ref.getDownloadURL().then(url=>{
          if(this.recette.images){this.recette.images.push({url:url,photographe:auth.currentUser.uid})}
        else{this.recette.images = [{url:url,photographe:auth.currentUser.uid}]}
        this.$forceUpdate();
        this.enregistrerModificationRecette("images");
        })  
        })   
      },
      enregistrerModificationRecette(field){
        var dbdoc;
        dbdoc = db.collection("users").doc(this.uid_recette)
        .collection("recettes").doc(this.recette.id);
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
      let recettes = this.$store.state.mesRecettes;
      let trouve = false;
      recettes.forEach((recette) => {
          if (recette.id === id) {
            this.recette = recette;
            this.quantite = recette.quantite;
            trouve = true
          }
        });
        if (trouve) {
          return;
        }
        
        db.collection("users").doc(auth.currentUser.uid).collection("recettes")
            .doc(id).get().then((data) => {
              this.recette = data.data();
              this.recette.id = id;
              this.$store.commit("setMesRecettes", [this.recette]);
            })
            .catch(() => {
              this.$router.push("/mesrecettes");
            });
      
      
    } 
    else {
      let idpersonne = this.$route.params.idpersonne;
      let idrecette = this.$route.params.idrecette;
      let autresRecettes = this.$store.state.autresRecettes;
      let recette = autresRecettes.find(recette=>recette.id==idrecette);
      if(recette){
        this.recette = recette;
        this.recette.quantite = this.recette.quantite || 4;
        this.quantite = this.recette.quantite;
        return;  
      }
      db.collection("users")
        .doc(idpersonne)
        .collection("recettes")
        .doc(idrecette)
        .get()
        .then((res) => {
            let recette = res.data();
            recette.id = res.id;
            recette.cuisinier = idpersonne;
            recette.quantite  = recette.quantite || 4;
            this.recette = recette;
            this.quantite = recette.quantite;
            this.$store.commit("setAutresRecettes",[recette]);
        });
      
    }
  },
  
};
</script>