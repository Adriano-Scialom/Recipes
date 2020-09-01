<template>
    <div>
        <v-container class="mt-5">
            <v-layout row justify-space-around>
                <v-flex xs12 md6>
                    <v-text-field v-model="nom" outlined label="Nom"></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row justify-space-around>
                <v-flex xs12 md6>
                    <v-text-field v-model="prenom" outlined label="Prenom"></v-text-field>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import all from '../fb';
const auth = all.auth;
const db = all.db;
export default {
    data(){
        return {nom:"",prenom:""}
    },
    
    methods:{
        toggle(){
            this.$store.commit('toggle_drawer')
        }
    },
    computed:{
        sortie(){return this.$store.state.drawer_sortie}
    },
    created(){
        
        if(auth.currentUser){
            db.collection("users").doc(auth.currentUser.uid).get().then(donnees=>{
                
            let personnnel = donnees.data()
            this.nom = personnnel.nom;
            this.prenom = personnnel.prenom;
            })
        } 
        
    }
}
</script>

<style scoped>

</style>