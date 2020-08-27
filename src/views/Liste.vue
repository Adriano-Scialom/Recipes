<template>
  <v-container>
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
              :to="'/recette:'+recette.id"
              three-lines
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
export default {
  data() {
    return {
      recettes: [
        { titre: "Bon", id: "afdjklg" ,commentaire:"test",note:4},
        { titre: "Bof", id: "fsjdkljd" ,note:5},
        { titre: "Genial", id: "fdsmfsd",commentaire:"test"},
      ],
    };
  },
};
</script>

