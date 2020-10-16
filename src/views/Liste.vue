<template>
  <v-dialog v-model="dialog" max-width=700px>
    <template v-slot:activator="{on,attrs}">
  <v-container class="mb-5">
    <v-layout class="ma-3" row justify-space-around>
      <v-flex xs6>
        <div :class="['text-center','text-md-h4','text-h5',color+'--text','text--ligthen-2']">Mes recettes</div>
      </v-flex>
    </v-layout>
    <v-layout class="mt-5" row justify-space-around>
      <v-flex xs10>
        <v-card>
          <v-expansion-panels accordion focusable>
            <v-expansion-panel :disabled="categorie.recettes.length==0" v-for="categorie in recettes" :key="categorie.nom">
              <v-expansion-panel-header>{{categorie.nom}}</v-expansion-panel-header>
              <v-expansion-panel-content :style="{'v-expansion-panel-content__wrap':{padding:'5px'}}" class="pa-0">
                <v-list>
                  <v-list-item
                    v-for="recette in categorie.recettes"
                    :key="recette.id"
                    router
                    :to="'/recette/'+recette.id"
                    two-line
                  >
                <v-list-item-avatar v-if="recette.images && recette.images.length>0" size=60><v-img :src="recette.images[0].url" big></v-img></v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-layout row class="mx-0">
                      <v-flex class="xs-8">
                      <span class="text-wrap"> {{recette.titre}}</span>
                      </v-flex>
                      <v-flex class="xs-4">
                      <span class="text-right" v-if="recette.noteMoyenne"><v-rating color="yellow accent-3" readonly dense :value="recette.noteMoyenne"></v-rating></span>
                      </v-flex>
                      </v-layout>
                    </v-list-item-title>
                    <v-list-item-subtitle v-if="recette.commentaire">{{recette.commentaire}}</v-list-item-subtitle>
                    
                    </v-list-item-content>
                    <v-list-item-action><v-btn :on="on" v-bind="attrs" color="red" @click="confirmationDelete(recette)" icon><v-icon>close</v-icon></v-btn></v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
    </template>
    <v-card v-if="recetteDialog">
      <v-card-title>Voulez-vous supprimer {{recetteDialog.titre}}?</v-card-title>
      <v-card-actions><v-btn text color="red" @click="supprimerRecette">Oui</v-btn><v-btn text @click="dialog = false">Annuler</v-btn></v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import all from "../fb";
const db = all.db;
const auth = all.auth;
import {categories} from '../outils';
export default {
  data() {
    return {
      auth,
      dialog:false,
      recetteDialog:null,
      
    };
  },
  methods:{
    confirmationDelete(recette){
      event.preventDefault();
      this.recetteDialog = recette;
      this.dialog = true;
    },
    supprimerRecette(){
      db.collection("users").doc(auth.currentUser.uid)
      .collection("recettes").doc(this.recetteDialog.id).delete();
      this.$store.commit('supprimerMaRecette',this.recetteDialog);
      this.dialog = false;
    }
  },
  computed: {
    color(){return this.$store.getters.color},
    recettes() {
      let recettesClassees = [];
      let recettesStore = this.$store.state.mesRecettes;
      recettesClassees.push({nom:"Non classées",recettes:recettesStore.filter(recette=>!recette.categorie || recette.categorie=="")});

      for (let i = 0;i<categories.length;i++){
        let categorie = categories[i].nom;
        recettesClassees.push({nom:categorie,recettes:recettesStore.filter(recette=>recette.categorie == categorie)});
      }
      
      return recettesClassees;
    },
    uid() {
      return this.$store.state.uid;
    },
  },
  created() {
    
    if (this.uid.length < 2) {this.$store.commit("setUid", auth.currentUser.uid);}
    
    if (this.$route.name=="ListeRecettes"){
    db.collection("users")
    .doc(this.uid)
    .collection("recettes").orderBy('titre')
    .get()
    .then((snapshot) => {
      
      var recettes_recus = [];
      snapshot.forEach((doc) => {
        let r = doc.data();
        r.id = doc.id;
        recettes_recus.push(r);
      });
      this.$store.commit("setMesRecettes", recettes_recus);
    });
    }
  },
};
</script>

<style lang="scss" scoped>
$expansion-panel-content-padding: 2px;

</style>