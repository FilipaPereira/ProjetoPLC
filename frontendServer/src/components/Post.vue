<template>
  <v-container class="grey lighten-5 pa-0" grid-list-md fluid>
    <v-row no-gutters>
      <v-col>
        <v-container class="my-5">
          <v-row dense>
            <v-col cols="12">
              <v-card elevation="10" flat class="text-xs-center ma-3">
                <v-list-item>
                  <v-list-item-avatar @click="goToProfile(user)">
                    <v-img v-if="hasAvatar(this.user)" :src="auxiliar(this.user)"></v-img>
                    <v-img v-else src="../assets/default_avatar.jpg"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="headline">
                      {{
                      user.nome
                      }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ this.date }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-col>
                      <v-btn text>
                        <v-icon>mdi-folder</v-icon>
                        <span>{{ post.grupo }}</span>
                      </v-btn>
                    </v-col>
                  </v-list-item-content>

                  <v-spacer></v-spacer>

                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn fab text small v-on="on">
                        <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-for="link in links" :key="link.text">
                        <v-list-item-title @click="exportPost()">{{ link.text }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item>

                <v-textarea
                  class="ma-3"
                  background-color="white"
                  color="black"
                  def
                  v-model="this.post.text"
                  disabled
                  auto-grow
                  outlined
                ></v-textarea>
                <v-row v-if="post.ficheiros.length !== 0">
                  <v-col v-for="i in post.ficheiros" :key="i">
                    <v-btn @click="download(i)" class="ma-2" rounded outlined>
                      <v-icon left>mdi-paperclip</v-icon>
                      {{i.name}}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <h4 class="ma-0">{{ this.post.likes.length }}</h4>
                  <v-btn @click="addLike()" fab text small>
                    <v-icon color="pink">mdi-heart</v-icon>
                  </v-btn>
                  <v-span>Like</v-span>
                  <v-btn fab text small @click="show = !show">
                    <v-icon color="grey">mdi-comment</v-icon>
                  </v-btn>
                  <v-span>Comment</v-span>
                  <v-spacer></v-spacer>
                  <v-icon >mdi-play</v-icon>
                  <span>{{this.post.classificador}}</span>
                </v-card-actions>
                <v-expand-transition>
                  <div v-show="show">
                    <v-divider></v-divider>

                    <v-card-text>
                      <div class="px-4">
                        <v-text-field
                          class="questrial"
                          height="45px"
                          background-color="grey lighten-3"
                          append-icon="mdi-camera "
                          placeholder="Write a comment..."
                          rounded
                        ></v-text-field>
                      </div>
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  computed: {
    ...mapGetters(["getToken"])
  },
  mounted: function() {
    const url =
      "https://api.manuelmariamoreno.pt/users/user/" + this.post.author;
    const url2 = "http://localhost:3061/users/user"
    let config = {
      headers: {
        Authorization: "Bearer " + this.getToken
      }
    };
    axios.get(url, config).then(dados => {
      this.user = dados.data.user;
      moment.locale();

      this.date = moment(this.post.date).format("MMM D , h:mm a");
    });
    axios.get(url2, config).then(dados2 => {
      this.userSeeing = dados2.data.user;
    });
    this.userLikes = this.post.likes
  },
  methods: {
    goToProfile(user){
      this.$router.push({name: "testing",params: user})
    },
    goToGroup(user){
      this.$router.push({name: "testing",params: user})
    },
    exportPost() {
      const url =
        "https://api.manuelmariamoreno.pt/posts/exportPost/" + this.post.id;
      let config = {
        responseType: "blob",
        headers: {
          Authorization: "Bearer " + this.getToken
        }
      };
      axios.get(url, config).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", this.post.id + ".txt"); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    },
    download(i) {
      const url =
        "https://api.manuelmariamoreno.pt/posts/download/" +
        this.post.id +
        "/" +
        i.name;
      let config = {
        responseType: "blob",
        headers: {
          Authorization: "Bearer " + this.getToken
        }
      };
      axios.get(url, config).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", i.name); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    },
    addLike() {
      let data = new FormData()
      if (!this.userLikes.includes(this.userSeeing.id)) {
       const url ="http://localhost:3061/posts/giveLike/" + this.post.id;
       let config = {
          headers: {
            Authorization: "Bearer " + this.getToken
          }
        };

        axios.post(url,data, config).then(() => {
          this.userLikes.push(this.userSeeing.id)
        });
        
      }
      else {
        const url1 ="http://localhost:3061/posts/takeLike/" + this.post.id;
        let config = {
          headers: {
            Authorization: "Bearer " + this.getToken
          }
        };
        axios.post(url1, data,config).then(() => {
          this.userLikes.splice(this.userLikes.indexOf(this.userSeeing.id),1)
        });
        
      }
    },
    hasAvatar(i) {
      if (i.avatar == null || i.avatar === undefined) return false;
      else return true;
    },
    auxiliar(i) {
      return (
        "https://api.manuelmariamoreno.pt/uploads/" +
        i.id +
        "/avatar/" +
        i.avatar
      );
    }
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userLikes: [],
      user: {},
      userSeeing: {},
      date: "",
      show: false,
      links: [
        { icon: "share", text: "Share" },
        { icon: "report", text: "Report" },
        { icon: "Export", text: "Export" }
      ]
    };
  }
};
</script>
