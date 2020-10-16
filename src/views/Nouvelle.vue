<template>
  <v-container>
    <v-layout class="mx-2 mb-5" row justify-space-around>
      <v-flex xs12 md10>
        <v-card class="pb-4">
          <v-card-title :class="['ml-3',color+'--text','text-h4','text--lighten-2']">Informations générales</v-card-title>
          <v-card-text class="special pb-0">
            <v-text-field
              :class="color+'--text'"
              label="Titre"
              v-model="recette.titre"
            ></v-text-field>
            <v-layout class="ml-0 mr-2" row>
              <v-flex xs3>
                <v-text-field
                  class=""
                  label="Durée"
                  type="number"
                  suffix="min"
                  v-model="recette.duree"
                ></v-text-field>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs6>
                <div class="">
                  <div :class="[color+'--text','ml-1']">Nombre de personnes : {{recette.quantite}}</div>
                  <v-slider ticks="always" v-model="recette.quantite" min="1" max="12"></v-slider>
                </div>
              </v-flex>
            </v-layout>
            <v-divider  class="grey"></v-divider>
          </v-card-text>
          <v-card-actions class="px-4">
            <v-text-field
              :rules="rules"
              :loading="loading"
              class="mt-0"
              label="Adresse URL"
              v-model="url"
            ></v-text-field>
            <v-btn
              text
              @click="rechercher"
              class="text-subtitle-2 ml-3 font-weight-medium"
              :color="color"
            >Rechercher recette</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout class="mx-2" row justify-space-around>
      <v-flex xs12 md10>
        <v-card>
          <v-card-title :class="['text-center','text-h4',color+'--text','text--lighten-2']">Ingrédients</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item class v-for="ingredient in recette.ingredients" :key="ingredient.id">
                <v-list-item-content class="py-1">
                    <v-layout row justify-space-around class="mx-0">
                      <v-flex xs3 md2 class="px-1">
                        <v-text-field v-model="ingredient.qte" type="number" label="Quantité"></v-text-field>
                      </v-flex>
                      <v-flex xs2 md1 class="px-1">
                        <v-text-field v-model="ingredient.unite" label="Unité"></v-text-field>
                      </v-flex>
                      <v-flex xs6 md7 class="px-1">
                        <v-text-field v-model="ingredient.nom" label="Nom"></v-text-field>
                      </v-flex>
                      <v-flex xs1>
                        <Menu class="pt-3"
                          :monter="()=>{let i = recette.ingredients.indexOf(ingredient);if(i>0){recette.ingredients.splice(i,1);recette.ingredients.splice(i-1,0,ingredient)}}"
                          :supprimer="()=>{recette.ingredients.splice(recette.ingredients.indexOf(ingredient),1)}"
                          :baisser="()=>{let i = recette.ingredients.indexOf(ingredient);if(i<recette.ingredients.length-1){recette.ingredients.splice(i,1);recette.ingredients.splice(i+1,0,ingredient)}}"
                        />
                      </v-flex>
                    </v-layout>
                 
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="recette.ingredients.push({ nom: '', unite: '', qte: null,id:getRandomInt(10000) })">
              Ajouter un ingrédient
              <v-icon right>plus_one</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout class="mt-5 mb-5 mx-2" row justify-space-around>
      <v-flex xs12 md10>
        <v-card>
          <v-card-title :class="['text-center','text-h4',color+'--text','text--lighten-2']">Etapes</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="etape in recette.etapes" :key="etape.id">
                <v-list-item-content class="py-1">
                    <v-layout row justify-space-around>
                      <v-flex xs11 class="px-3">
                        <v-text-field v-model="etape.texte" label="Description"></v-text-field>
                      </v-flex>
                      <v-flex xs1>
                        <Menu
                          :monter="()=>{let i = recette.etapes.indexOf(etape);if(i>0){recette.etapes.splice(i,1);recette.etapes.splice(i-1,0,etape)}}"
                          :supprimer="()=>{recette.etapes.splice(recette.etapes.indexOf(etape),1)}"
                          :baisser="()=>{let i = recette.etapes.indexOf(etape);if(i<recette.etapes.length-1){recette.etapes.splice(i,1);recette.etapes.splice(i+1,0,etape)}}"
                        />
                      </v-flex>
                    </v-layout>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="recette.etapes.push({texte:'',id:getRandomInt(10000)})">
              Ajouter une étape
              <v-icon right>plus_one</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-space-around>
      <v-flex xs6 md6 class="ma-3">
        <div class="text-center">
          <v-btn
            text
            @click="enregistrer"
            class="success text-h5 font-weight-bold"
          >{{texteBoutonValider}}</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import Menu from "../components/ReordonnerMenu.vue";
import all from "../fb";
import firebase from "firebase/app";
import "firebase/functions";
const auth = all.auth;
const db = all.db;

const recettes = all.db
  .collection("users")
  .doc(auth.currentUser.uid)
  .collection("recettes");
const recherche = firebase.functions().httpsCallable("recette");
export default {
  components: { Menu },
  data() {
    return {
      recette: {
        titre: "",
        ingredients: [{ nom: "", unite: "", qte: null,id:this.getRandomInt(10000) }],
        etapes: [{ texte: "",id:this.getRandomInt(10000) }],
        duree: null,
        quantite: 4,
        id: null,
      },
      url: "",
      rules: [
        (v) =>
          /(http|https):\/{2}[\w./-]+/.test(v) || "Indiquer une adresse valide",
      ],
      texteBoutonValider: "Enregistrer Recette",
      loading: false,
    };
  },
  computed:{
    color(){return this.$store.getters.color},
  },
  watch:{
    "$route":"vider"
  },
  methods: {
    vider(){
      this.recette = {}
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    enregistrer() {
      if (this.recette.id) {
        recettes
          .doc(this.recette.id)
          .update(this.recette)
          .then(() => {
            this.$store.commit("setMesRecettes", [this.recette]);
            this.$router.replace("/recette/" + this.recette.id);
          });
      } else {
        let res = recettes.doc();
        this.recette.id = res.id;
        res.set(this.recette).then(() => {
          this.$store.commit("setMesRecettes", [this.recette]);
          this.$router.replace("/recette/" + res.id);
        });
      }
    },
    rechercher() {
      if (/(http|https):\/{2}[\w./-]+/.test(this.url)) {
        this.loading = true;
        recherche({ adresse: this.url }).then((result) => {
          let id = result.data.id;
          recettes
            .doc(id)
            .get()
            .then((data) => {
              this.recette = data.data();
              this.recette.id = id;
              this.loading = false;
              this.url = "";
              this.texteBoutonValider = "Valider Modifications";
            });
        });
      }
    },
  },

  created() {
    if (this.$route.params.id) {
      this.texteBoutonValider = "Valider Modifications";
      let id = this.$route.params.id;
      let recettes = this.$store.state.mesRecettes;
      let trouve = false;
      recettes.forEach((recette) => {
          if (recette.id === id) {
            this.recette = recette;
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
      
  },
};
</script>

<style scoped>
.special{
  background-color: white;
}
</style>