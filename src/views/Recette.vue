<template>
  <div>
    <v-container fluid>
      <v-layout row justify-space-around>
        <v-flex xs6 class="my-3">
            <v-card class="px-3 py-1">
          <h3 class="blue--text text-center">{{recette.titre}}</h3>
            </v-card>
        </v-flex>
      </v-layout>
      <v-layout row justify-space-around>
        <v-flex class="my-3" xs6>
          <v-card  max-height="100">
            <v-card-text>
              <div>Nombre de personnes : {{recette.qte}}</div>
            </v-card-text>
            <v-card-actions>
              <v-slider v-model="recette.qte" min="1" max="12"></v-slider>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row justify-space-around>
        <v-flex xs6 offset-md="12">
          <v-card class="mb-2">
            <h2 class="ml-2 blue--text text--lighten-2">Ingrédients</h2>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row class="mt-2" justify-space-around>
        <v-flex xs6>
          <v-card>
            <v-list>
              <v-list-item v-for="ingredient in recette.ingredients" :key="ingredient.nom">
                <v-list-item-content>
                  <v-list-item-title>{{ingredient.nom}}</v-list-item-title>
                  <v-list-item-subtitle>{{ingredient.qty*recette.qte/recette.qte_original}} {{ingredient.unit}}</v-list-item-subtitle>
                </v-list-item-content>
               
              </v-list-item>

            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row class="mt-5" justify-space-around>
        <v-flex xs6>
          <v-card class="mb-2">
            <h2 class="ml-2 blue--text text--lighten-1">Etapes</h2>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row class="mt-2" justify-space-around>
        <v-flex xs6>
          <v-card>
            <v-list>
              <v-list-item v-for="etape in recette.etapes" :key="etape.nom">
                <v-list-item-content>
                  <v-list-item-title>{{etape.text}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recette: {
        titre: "Recette tres bonne",
        temps: 40,
        qte: 4,
        qte_original: 4,
        ingredients: [
          { nom: "Farine", unit: "g", qty: "20" },
          { nom: "Levure", unit: "", qty: "20" },
          { nom: "Sel", unit: "", qty: "0" },
        ],
        etapes: [
          { text: "Commencer" },
          { text: "Continuer" },
          { text: "Finir" },
        ],
      },
    };
  },
  computed: {},
};
</script>