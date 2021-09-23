<template>
    <v-container style='height:100%'>
        <ais-instant-search
        index-name="recettes"
        :search-client="searchClient"
        class="mb-5" style="height:100%;display:flex;flex-direction:column;">
            <ais-configure :hits-per-page.camel=6 :query="initial"/>
            <ais-autocomplete style='flex-grow:1;' >
                <template v-slot="{ currentRefinement, indices, refine }">
                    <div style='position:relative;'>
                        <v-text-field
                        type="search"
                        :value="currentRefinement"
                        label="Recherche"
                        @input="refine($event)"
                        outlined
                        hide-details
                        autocomplete='off'
                        ></v-text-field>
                            
                            <v-list class="mt-5" v-if="currentRefinement">
                                <v-list-item style="margin:0.6em;box-shadow:0 0 4px black;" v-for="hit in indices[0].hits" :key="hit.objectID" @click='$router.push((uid===hit.cook ? "/recette/"+hit.objectID : "/piqueurderecette/"+hit.cook+"/"+hit.objectID))'>
                                    <v-list-item-avatar size="60" v-if="hit.url"><v-img :src="hit.url.url"></v-img></v-list-item-avatar>
                                    <v-list-item-title v-html="hit._highlightResult.title.value"></v-list-item-title> 
                                    <span v-for='ingredient in hit._highlightResult.ingredients.filter(ing=>ing.name.matchedWords.length>0)' :key="ingredient.name.value" v-html="ingredient.name.value"></span>
                                </v-list-item>
                            </v-list>
                            
    
                    </div>
                </template>
            </ais-autocomplete>
            
                <ais-pagination style=''>
                    <template
                        v-slot="{
                        currentRefinement,
                        nbPages,
                        refine
                        }"
                    >
                        
                        <v-pagination
                        v-bind:value="currentRefinement+1"
                        :length="nbPages"
                        @input="refine($event-1)"
                        ></v-pagination>
                        
    
                </template>
            </ais-pagination>
            
        </ais-instant-search>
    </v-container>
</template>

<script>
import algoliasearch from 'algoliasearch'

export default {
    data(){return {
        searchClient: algoliasearch(
            'WY84ZY0FPX',
            '80b9e24c76513fbf18461bec39e4a44b'
            ),
        initial:''
    }},
    computed:{
        console:()=>console
    },
    mounted(){
        if(this.$route.params.text){
            this.initial = this.$route.params.text;
        }
        console.log(this.$route.params);
    }

}
</script>