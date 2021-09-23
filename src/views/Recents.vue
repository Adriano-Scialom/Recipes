<template>
    <v-container>
        <ais-instant-search
        index-name="recettes"
        :search-client="searchClient"
        class="mb-5">
            <ais-configure :hits-per-page.camel=5 />
            <ais-autocomplete>
                <template v-slot="{ currentRefinement, indices, refine }">
                    <div style='position:relative;'>
                        <v-text-field
                        type="search"
                        :value="currentRefinement"
                        label="Recherche"
                        @input="refine($event)"
                        outlined
                        v-on:focus='focused=true'
                        v-on:blur='setTimeout(()=>{focused=false},100)'
                        hide-details
                        autocomplete='off'
                        @keypress="(e)=>{if(e.keyCode==13){$router.push({name:'Search',params: {text: currentRefinement}})}}"
                        ></v-text-field>
                        <v-sheet elevation=5 v-if="currentRefinement && focused" class="pa-2" style='position:absolute;z-index:1;left:0;right:0'>
                            <v-list v-if="currentRefinement && focused">
                                <v-list-item v-for="hit in indices[0].hits" :key="hit.objectID" @click='$router.push((uid===hit.cook ? "/recette/"+hit.objectID : "/piqueurderecette/"+hit.cook+"/"+hit.objectID))'>
                                    <v-list-item-title>{{hit.title}}</v-list-item-title> 
                                </v-list-item>
                            </v-list>
                        </v-sheet>
                    </div>
                </template>
            </ais-autocomplete>
        </ais-instant-search>

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
import algoliasearch from 'algoliasearch'
const {db,auth} = all;
export default {
    data(){
        return{
            uid:auth.currentUser.uid,
            recettes:[],
            searchClient: algoliasearch(
            'WY84ZY0FPX',
            '80b9e24c76513fbf18461bec39e4a44b'
            ),
            focused:false
        
        }
    },
    computed:{
        color(){return this.$store.getters.color},
        console:()=>console,
        
    },
    methods:{
        setTimeout:(fn,time)=>setTimeout(fn,time)
    },
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
    mounted(){
        console.log(this.$refs.searchbar);
    }
}
</script>