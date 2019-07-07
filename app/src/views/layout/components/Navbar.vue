<template>
  <v-toolbar dense app dark fixed clipped-left color="primary">
    <v-toolbar-side-icon @click.stop="toggleSideBar"></v-toolbar-side-icon>

    <v-toolbar-title>
      {{ $t('app.name') }}
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-tooltip left>
      <v-btn slot="activator" icon>
        <v-icon>fas fa-sign-out-alt</v-icon>
      </v-btn>
      {{ $t('logout.title') }}
    </v-tooltip>

  </v-toolbar>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    toggleSideBar() {
      this.$store.commit('TOGGLE_SIDEBAR');
    },
  },
};
</script>
