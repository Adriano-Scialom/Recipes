<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs6 md4 v-for="categorie in categories" :key="categorie.nom">
                <v-card  class="ma-2">
                    <v-card-title :class="color+'--text'">{{categorie.nom}}</v-card-title>
                    <v-card-text class="pa-0"><v-img :src="categorie.image" aspect-ratio="1" contain max-height="300"></v-img></v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer><v-btn router :to="'/categories/'+categorie.nom" text>Acceder</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { categories } from '../outils'
export default {
    data(){
        return {
            categories,
            
        }
    },
    computed:{
        color(){return this.$store.getters.color},
    },
    methods:{
        
    }
}
</script>