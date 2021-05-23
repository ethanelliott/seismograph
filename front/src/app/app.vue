<template>
  <v-app class="back">
    <v-system-bar app dark color="primary darken-2" class="text-center">
      <span class="mx-auto">SOMETHING</span>
    </v-system-bar>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <div class="logo">
          <v-img class="mr-4" contain height="60" width="60" :src="require('@/assets/seismograph.png')"></v-img>
          <h1>SEISMOGRAPH</h1>
        </div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs" icon>
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-theme-light-dark</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                Dark Theme
              </v-list-item-content>
              <v-list-item-action>
                <v-switch color="primary" v-model="darkTheme"></v-switch>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    darkTheme: false,
  }),
  watch: {
    darkTheme(val) {
      this.$vuetify.theme.dark = val;
      localStorage.setItem('theme', val ? 'dark' : 'light');
    }
  },
  mounted() {
    const theme = localStorage.getItem('theme');
    this.darkTheme = theme === 'dark';
  }
};
</script>

<style lang="scss">
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  h1 {
    font-weight: lighter;
  }

  .back {
    background: black !important;
  }
}

.theme--light {
  .v-main {
    background: #ececec !important;
  }
}

.theme--dark {
  .v-main {
    background: #161616 !important;
  }
}
</style>
