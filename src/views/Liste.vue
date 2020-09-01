<template>
  <v-container class="mb-5">
    <v-layout class="ma-3" row justify-space-around>
      <v-flex xs6>
        <div class="text-center text-h4 blue--text text--ligthen-2">Mes recettes</div>
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
              :to="'/recette/'+recette.id"
              two-line
            >
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
    return {};
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
    const recettes = this.$store.state.recettes;
    console.log(auth.currentUser);
    if (recettes.length === 0) {
      if (this.uid.length < 2) {
        if (auth.currentUser) {
          this.$store.commit("setUid", auth.currentUser.uid);
        } else {
          this.$router.push("/connexion");
        }
      }
      db.collection("users")
        .doc(this.uid)
        .collection("recettes")
        .get()
        .then((snapshot) => {
          console.log(snapshot);
          var recettes_recus = [];
          snapshot.forEach((doc) => {
            let r = doc.data();
            r.id = doc.id;
            recettes_recus.push(r);
          });
          this.$store.commit("setRecettes", recettes_recus);
        });
    }
  },
};
</script>

