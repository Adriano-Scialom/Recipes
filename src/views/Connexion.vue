<template>
  <v-container class="ma-5">
    <v-layout row justify-space-around>
      <v-flex xs10 md6>
        
          <v-card class="pa-5 pt-1">
            <v-card-title class="blue--text text-center text-h4">Connexion</v-card-title>
            <v-text-field
                  label="Adresse email"
                  :rules="emailRules"
                  v-model="mail"
                  outlined
                  class="blue--text"
                ></v-text-field>

                <v-text-field
                  label="Mot de passe"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  counter
                  @click:append="show = !show"
                  :rules="mdpRules"
                  v-model="motdepasse"
                  outlined
                ></v-text-field>

                <v-card-actions>
                  <v-layout row justify-space-around wrap>
                    <v-flex xs8 md4>
                      <v-btn  @click="connexion"  class="align-center">
                        <v-icon left>login</v-icon>
                        <div>Connexion</div>
                      </v-btn>
                    </v-flex>
                    <v-flex xs8 md4>
                      <v-btn router to="/oublie"><v-icon left>mood_bad</v-icon>Mot de passe oublié ?
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-actions>
          </v-card>
        
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackOpen">Identifiant ou mot de passe incorrect</v-snackbar>
  </v-container>
</template>

<script>
import all from '../fb';
const auth = all.auth;
export default {
  data() {
    return {
      show: false,
      emailRules: [
        (v) => !!v || "E-mail requit",
        (v) => /^[\w-.]+@[\w-]+\.[a-zA-Z]+(\.[a-zA-Z]+)?$/.test(v) || "E-mail must be valid",
      ],
      mdpRules: [
        (v) => !!v || "Mot de passe requit",
        (v) => v.length > 6 || "Mot de passe trop court",
      ],
      mail: "",
      motdepasse: "",
      snackOpen:false,
    };
  },
  methods: {
    connexion() {
      console.log("connexion");
      auth.signInWithEmailAndPassword(this.mail,this.motdepasse)
      .then(credentials=>{console.log(credentials.user.uid);
      this.$store.commit('setUid',credentials.user.uid);
      this.$router.push('/mesrecettes')
      }).catch(()=>this.snackOpen=true)
    },
  },
};

</script>

<style scoped>
.body {
  background-color: green;
}
</style>