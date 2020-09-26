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
              :to="recette.profil==auth.currentUser.uid ?'/recette/'+recette.id:'/piqueurderecette/'+recette.profil+'/'+recette.id"
              two-line
            >
            <v-list-item-avatar v-if="recette.images && recette.images.length>0" size=60><v-img :src="recette.images[0].url" big></v-img></v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{recette.titre}}</v-list-item-title>
                <v-list-item-subtitle v-if="recette.commentaire">{{recette.commentaire}}</v-list-item-subtitle>
                <span class="text-right" v-if="recette.note">{{recette.note}}/5</span>
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
const db = all.db;
const auth = all.auth;

export default {
  data() {
    return {
      auth,
      
    };
  },
  computed: {
    recettes() {
      return this.$store.state.recettes;
    },
    uid() {
      return this.$store.state.uid;
    },
  },
  created() {
    if(this.$route.name=="CategoriePrecise"){
      let categorie = this.$route.params.type.charAt(0).toUpperCase() + this.$route.params.type.slice(1)
      db.collectionGroup("recettes").where("public","==",true).where("categorie","==",categorie).orderBy('titre')
      .get()
      .then(snap=>{
        var recettes_recus = [];
        snap.forEach(doc=>{
          let r = doc.data();
          r.id = doc.id;
          r.profil = doc.ref.parent.parent.id;
          recettes_recus.push(r);
        })
        this.$store.commit("setRecettes", recettes_recus);
      })
    }
  },
};

</script>