<template>

    <v-container>
        <v-snackbar v-model="montreAlert" top color="success"><span class="font-weight-medium">Email de modification de votre mot de passe envoyé</span><template v-slot:action="{ attrs }"><v-btn right v-bind="attrs" text @click="montreAlert=false">Fermer</v-btn></template></v-snackbar>
        <v-snackbar v-model="echec" top color="error"><span class="font-weight-bold" :timeout="8000">Email non valide</span><template v-slot:action="{ attrs }"><v-btn v-bind="attrs" right text @click="echec=false">Fermer</v-btn></template></v-snackbar>

        <v-layout row justify-space-around>
            <v-flex xs12 md10>
                <v-card class="mx-3">
                    <v-card-title class="blue--text text-h5 font-weight-bold ml-5">Mot de passe oublié ?</v-card-title>
                    <v-card-text>
                    <v-text-field class="mx-5" v-model="email" label="Adresse email" outlined :rules="rules"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text :disabled="!valid || montreAlert" @click="recuperer">
                            <v-icon left>email</v-icon>
                            <h3 :class="`text-subheading ${valid ? 'blue--text' : 'grey--text'} `">Récupérer mot de passe par mail</h3></v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    
    </v-container>
   


</template>

<script>
import all from '../fb';
let auth = all.auth;
export default {
    data(){
        return {email:'',
        rules:[(v) => !!v || "E-mail requit",
        (v) => /.+@.+/.test(v) || "L'adresse email doit être valide"],
        montreAlert:false,
        echec: false,
        }
    },
    computed:{
        valid(){
            return !!this.email && /^[\w-.]+@[\w-]+\.[a-zA-Z]+(\.[a-zA-Z]+)?$/.test(this.email)
        }
    },
    methods:{
        recuperer(){
            
            auth.sendPasswordResetEmail(this.email).then(()=>{
                this.montreAlert = true;
                
            }).catch(()=>{
                this.echec = true;}
            );
            
        }
    },
}
</script>