<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="8" lg="6">
        <v-card class="elevation-12">
          <v-toolbar color="purple" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="email"
                id="email"
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                type="text"
              />
              <v-text-field
                v-model="password"
                id="password"
                label="Password"
                name="password"
                type="password"
                prepend-icon="mdi-lock"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="submit()" v-on:keyup.enter="onEnter" color="purple"
              >Login</v-btn
            >
            <v-spacer />
            <v-btn to="/register">Sign Up</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapMutations,mapGetters } from "vuex";
import Socket from "../store/modules/socket";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  mounted: function(){
    if(this.loggedIn){
      //eslint-disable-next-line no-console
      console.log("this -> "+this.loggedIn)
      this.$root.$emit("entered");
      this.$router.push("/home");
    }
  },
  methods: {
    ...mapMutations(["setToken"]),
    ...mapGetters(["loggedIn"]),
    submit() {
      
      axios
        .post("https://api.manuelmariamoreno.pt/users/login", {
          email: this.email,
          password: this.password
        })
        .then(response => {
          switch (response.status) {
            case 200:
              this.setToken(response.data.token);
              var mssge = {
                token: response.data.token
              };
              Socket.send(JSON.stringify(mssge));
              this.$root.$emit("entered");
              this.$router.push("/home");
              break;
            default:
              this.$router.push("/");
          }
        });
    }
  }
};
</script>
