<template>
    <v-container>
        <v-layout v-if="!!profil" row justify-space-around>
            <v-flex xs10 md8>
                <v-card>
                    <v-list v-if="!!profil.recettes">
                        <v-list-item v-for="recette in profil.recettes" :key="recette.titre" router :to="'/piqueurderecette/'+profil.id+'/'+recette.id">
                            <v-list-item-title class="text-capitalize blue--text">{{recette.titre}}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
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
        complete(dbProfil){
            dbProfil.collection("recettes").where("public","==",true).get()
                .then(res=>{
                    this.profil.recettes = []
                    res.forEach(recette=>{
                        let recetteData = recette.data();
                        recetteData.id = recette.id;
                        this.$store.commit('addRecetteToPerson',{id:this.$route.params.id,recette:recetteData});
                        this.$forceUpdate();
                    })
                })
        }
    },
    computed:{
        profil(){
            return this.$store.getters.getPerson(this.$route.params.id)
        }
    },
    created(){
        if(this.profil){
            if(!this.profil.recettes || this.profil.recettes.length==0){
                this.complete(db.collection("users").doc(this.profil.id))
            }
        }
        else{
            let dbProfil = db.collection("users").doc(this.$route.params.id)
            dbProfil.get().then((res)=>{
                let personne = res.data();
                personne.id = res.id;
                
                this.$store.commit('addModifyPerson',personne);
                this.$forceUpdate();
                this.complete(dbProfil);
            })
        }
    },
}
</script>