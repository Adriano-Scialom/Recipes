<template>
    <v-container>
        <v-layout  row justify-space-around>
            <v-flex xs10 md8>
                <v-card v-if="recettes.length>0">
                    <v-card-title v-if="profil && profil.prenom">Recettes de {{profil.prenom}}</v-card-title>
                    <v-list>
                        <v-list-item v-for="recette in profil.recettes" :key="recette.titre" router :to="'/piqueurderecette/'+profil.id+'/'+recette.id">
                            <v-list-item-title class="text-capitalize blue--text">{{recette.titre}}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
                <div v-else class="text-h4 mx-5 my-3 blue--text text--darken-2 text-center">
                        Ce cuisinier n'a pas encore de recettes..
                </div>
                    
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import all from '../fb';
const db = all.db;
export default {
    data(){
        return {
            
        }
    },
    methods:{
   
    },
    computed:{
        recettes(){
            return this.$store.state.autresRecettes.filter(recette=>recette.cuisinier == this.$route.params.id)
        },
        profil(){
            return this.$store.getters.getPerson(this.$route.params.id)
        }
    },
    created(){
        let dbProfil = db.collection("users").doc(this.$route.params.id);
        dbProfil.collection("recettes").orderBy('titre').where("public","==",true).get()
                .then(res=>{
                    let toAddRecettes = [];
                    res.forEach(recette=>{
                        let recetteData = recette.data();
                        recetteData.id = recette.id;
                        recetteData.cuisinier = this.$route.params.id
                        toAddRecettes.push(recetteData);
                    })
                    this.$store.commit('setAutresRecettes',toAddRecettes);
                    this.$forceUpdate();
                })
        if(!this.profil){
            dbProfil.get().then((res)=>{
                let personne = res.data();
                personne.id = res.id;
                this.$store.commit('addModifyPerson',personne);
            })
        }
        
    },
}
</script>

<style scoped>
.center{
    margin-top:50%;
}
</style>