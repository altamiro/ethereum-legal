<template>
  <v-footer app fixed height="20">
    <v-card class="flex" flat tile>
      <v-card-actions class="primary justify-center subheading white--text">{{ $t('app.footer', { year: ano }) }}</v-card-actions>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'FooterMain',
  data: () => ({
    ano: new Date().getFullYear(),
  }),
};
</script>
