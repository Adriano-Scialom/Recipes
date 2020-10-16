<template>
    <v-container class="mb-5">
    <v-layout class="ma-3" row justify-space-around>
      <v-flex xs6>
        <div class="text-center text-h4 blue--text text--ligthen-2">{{"Recettes de "+$route.params.type}}</div>
      </v-flex>
    </v-layout>
    <v-layout class="mt-5" row justify-space-around>
      <v-flex xs10>
        <v-card>
          <v-list>
            <v-list-item
              v-for="recette in recettes"
              :key="recette.id"
              router
              :to="!recette.cuisinier ?'/recette/'+recette.id:'/piqueurderecette/'+recette.cuisinier+'/'+recette.id"
              two-line
            >
            <v-list-item-avatar v-if="recette.images && recette.images.length>0" size=60><v-img :src="recette.images[0].url" big></v-img></v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  <v-layout row class="mx-0">
                  <v-flex class="xs-8">
                  <span>{{recette.titre}}</span>
                  </v-flex>
                  <v-flex class="xs-4">
                  <span class="text-right" v-if="recette.noteMoyenne"><v-rating color="yellow accent-3" readonly dense :value="recette.noteMoyenne"></v-rating></span>
                  </v-flex>
                  </v-layout>
                </v-list-item-title>
                <v-list-item-subtitle v-if="recette.cuisinier && recette.prenom">{{recette.prenom}}</v-list-item-subtitle>
                
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import all from "../fb";
const {db,auth} = all;


export default {
  data() {
    return {
      auth,
    }
  },
  computed: {
    recettes() {
      let categorie = this.$route.params.type.charAt(0).toUpperCase() + this.$route.params.type.slice(1)
      return (this.$store.state.mesRecettes+this.$store.state.autresRecettes).filter(recette=>recette.categorie && recette.categorie == categorie);
    },
   
  },
  created() {
      let categorie = this.$route.params.type.charAt(0).toUpperCase() + this.$route.params.type.slice(1)
      
      db.collectionGroup("recettes").where("public","==",true).where("categorie","==",categorie).orderBy('titre')
      .get()
      .then(snap=>{
        let mesRecettes = [];
        let autresRecettes = [];
        snap.forEach(doc=>{
          let r = doc.data();
          r.id = doc.id;
          let cuisinier = doc.ref.parent.parent.id;
          if(cuisinier===auth.currentUser.uid)
            mesRecettes.push(r);
          else{
            r.cuisinier = cuisinier;
            autresRecettes.push(r);
          }
        })
        this.$store.commit("setMesRecettes", mesRecettes);
        this.$store.commit("setAutresRecettes",autresRecettes);
      })
    
  },
};

</script>