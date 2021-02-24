<template>
    <v-container>
        <v-layout row justify-space-around>
            <v-flex xs10 md8>
                <v-card v-if="recettes.length>0">
                    <v-card-title :class="color+'--text'" v-if="profil && profil.prenom">Recettes de {{profil.prenom}}</v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item class="px-2" v-for="recette in recettes" :key="recette.titre" router :to="'/piqueurderecette/'+profil.id+'/'+recette.id">
                                <v-list-item-avatar v-if="recette.images && recette.images.length>0" size=60><v-img :src="recette.images[0].url" big></v-img></v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title :class="['text-capitalize', color+'--text']">
                                    <v-layout row class="mx-0">
                                    <v-flex class="xs-8">
                                    <span class="text-wrap">{{recette.titre}}</span>
                                    </v-flex>
                                    <v-flex class="xs-4">
                                    <span class="text-right" v-if="recette.noteMoyenne"><v-rating color="yellow accent-3" half-increments readonly dense :value="recette.noteMoyenne"></v-rating></span>
                                    </v-flex>
                                    </v-layout>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
                <div v-else :class="['text-h4','mx-5','my-3',color+'--text','text--darken-2','text-center']">
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
        color(){return this.$store.getters.color},
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