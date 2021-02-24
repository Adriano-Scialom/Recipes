<template>
    <v-container>
        <v-card>
            <v-card-title :class="[color+'--text','text-h6']">Recettes recentes</v-card-title>
            <v-card-text>
                <v-list>
                    <v-list-item class="px-2" router :to="recette.cuisinier==uid ? '/recette/'+recette.id: '/piqueurderecette/'+recette.cuisinier+'/'+recette.id" v-for="recette in recettes" :key="recette.id">
                        <v-list-item-avatar v-if="recette.images && recette.images.length>0" size=60><v-img :src="recette.images[0].url" big></v-img></v-list-item-avatar>
                        <v-list-item-content>
                        <v-list-item-title class="text-wrap">{{recette.titre}}</v-list-item-title>
                        <v-list-item-subtitle><span v-if="recette.prenom">{{recette.prenom}} - </span>{{recette.creationTime.toDate().toLocaleDateString('fr-FR')}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import all from '../fb';
const {db,auth} = all;
export default {
    data(){
        return{
            uid:auth.currentUser.uid,
            recettes:[],
            
        }
    },
    computed:{
        color(){return this.$store.getters.color},
    },
    methods:{},
    created(){
         db.collectionGroup("recettes").where("public","==",true)
         .orderBy("creationTime",'desc').limit(30)
         .get().then(snaps=>{
             snaps.forEach(snap=>{
                 let recette = snap.data();
                 recette.id = snap.id;
                 recette.cuisinier = snap.ref.parent.parent.id;
                 if(recette.cuisinier===this.uid)
                    this.$store.commit('setMesRecettes',[recette])
                 else
                    this.$store.commit('setAutresRecettes',[recette])
                 this.recettes.push(recette);
             })
         })

    },
}
</script>