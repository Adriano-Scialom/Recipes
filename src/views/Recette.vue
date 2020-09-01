<template>
  <div>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 md3 offset-md1 class="pa-3">
          <v-card v-if="recette.quantite" max-height="100">
            <v-card-text>
              <div>Nombre de personnes : {{quantite}}</div>
            </v-card-text>
            <v-card-actions>
              <v-slider v-model="quantite" min="1" max="12"></v-slider>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 md6 offset-md1  class="pa-3">
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
                  <h2 class="ml-3 blue--text text--lighten-2">Ingrédients</h2>
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
                          <span
                            v-if="ingredient.qte && ingredient.qte>0"
                          >{{Math.round(100*ingredient.qte*quantite/recette.quantite)/100}} {{ingredient.unite}} <span v-if="ingredient.unite">de </span></span>
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
        <v-flex xs4 class="mt-5 ">
          <div class=""><v-btn v-if="$route.name==='Recette'" text @click="modifier" class="info--text text-h6">Modifier recette
            </v-btn>
            <v-btn v-if="$route.name==='Piqueur'" text @click="copier" class="info--text text-h6">Copier Recette sur espace personnel
            </v-btn>
            </div>

        </v-flex>
      </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
      
    </v-container>
  </div>
</template>

<script>
import all from "../fb";
const auth = all.auth;
const db = all.db;
export default {
  data() {
    return {
      recette:{},
      quantite:0,
    };
  },
  created() {
      if(this.$route.name==="Recette"){
        let id = this.$route.params.id;
        let recettes = this.$store.state.recettes;
        if (recettes.length==0){
                db.collection("users").doc(auth.currentUser.uid).collection("recettes").doc(id).get().then((data)=>
                {this.recette = data.data();
                this.recette.id = id;
                this.quantite = this.recette.quantite;
                this.$store.commit('addRecette',this.recette)})
                .catch(()=>{this.$router.replace("/mesrecettes");})
        }
        else{
        recettes.forEach((recette) => {
          if (recette.id === id) {
            this.recette = recette;
            this.quantite = recette.quantite;
          }
        });
        if(!this.recette.etapes){this.$router.replace('/mesrecettes');}
        }
      }
      else{
        let params = this.$route.params;
        let personne = this.$store.state.personnes.filter((personne)=>{return personne.id==params.idpersonne})[0];
        if(personne){
          let recette = personne.recettes.filter((recette)=>{return recette.id===params.idrecette})[0];
          if(recette){
            recette.id = params.idrecette;
            this.recette = recette;
            this.recette.quantite = this.recette.quantite || 4;
            this.quantite = this.recette.quantite;}
        }
        if(!this.recette.titre){
          db.collection("users").doc(params.idpersonne)
          .collection("recettes")
          .doc(params.idrecette).get()
          .then((res)=>{
            let recette = res.data();
            recette.id = res.id;
            this.recette = recette;
            this.recette.quantite = this.recette.quantite || 4;
            this.quantite = recette.quantite;
          })
        }
      }
  },
  methods:{
    modifier(){
      this.$router.push('/modifier/'+this.recette.id);
    },
    copier(){
      if(this.$route.params.idpersonne != auth.currentUser.uid){
        db.collection("users").doc(auth.currentUser.uid)
        .collection("recettes")
        .add(this.recette).then((snap)=>{
            this.$router.push('/recette/'+snap.id);
        })
      }
    }
  },
};
</script>