<template>
  <v-toolbar dense app dark fixed clipped-left color="primary">
    <v-toolbar-side-icon @click.stop="toggleSideBar"></v-toolbar-side-icon>

    <v-toolbar-title>
      {{ $t('app.name') }} - {{ usuario }}
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-tooltip left>
      <v-btn slot="activator" icon @click="logOut">
        <v-icon>fas fa-sign-out-alt</v-icon>
      </v-btn>
      {{ $t('logout.title') }}
    </v-tooltip>

  </v-toolbar>
</template>

<script>
import auth from '@/authService'

export default {
  name: 'Navbar',
  computed: {
    usuario() {
      return this.$store.state.usuario;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.commit('TOGGLE_SIDEBAR');
    },
    logOut() {
      auth.logOut();
      this.$router.push({ path: '/login' });
    }
  },
};
</script>
