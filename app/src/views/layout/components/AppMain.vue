<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout>

        <div class="text-xs-center">
          <v-dialog v-model="loading" persistent width="300">
            <v-card color="success" dark>
              <v-card-text> {{ $t('app.logging') }} <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear></v-card-text>
            </v-card>
          </v-dialog>
        </div>

        <router-view :key="key"/>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.fullPath;
    },
    loading() {
      return this.$store.state.loading;
    }
  },
};
</script>