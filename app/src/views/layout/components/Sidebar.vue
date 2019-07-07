<template>
  <v-navigation-drawer
    :clipped="$vuetify.breakpoint.lgAndUp"
    v-model="sidebar"
    fixed
    app
    :width="200"
  >
    <v-list dense>
      <template v-for="item in items">
        <v-layout v-if="item.heading" :key="item.heading" row align-center>
          <v-flex xs6>
            <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
          </v-flex>
        </v-layout>
        <v-list-group
          v-else-if="item.children"
          v-model="item.model"
          :key="item.text"
          :prepend-icon="item.model ? item.icon : item['icon-alt']"
          append-icon
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title class="menu_sub_title">{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="(child, i) in item.children" :key="i" @click>
            <v-list-tile-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-if="child.link">
                <router-link class="menu_link" :to="child.link">{{ child.text }}</router-link>
              </v-list-tile-title>
              <v-list-tile-title v-else>{{ child.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile v-else :key="item.text">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-if="item.link">
              <router-link class="menu_link" :to="item.link">{{ item.text }}</router-link>
            </v-list-tile-title>
            <v-list-tile-title v-else>{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import i18n from "@/i18n";

export default {
  name: "Sidebar",
  data: () => ({
    mini: false,
    right: null,
    items: [
      i18n.t("menu.dashboard"),
      i18n.t("menu.nota_fiscal")
    ]
  }),
  computed: {
    sidebar: {
      get() {
        return this.$store.state.sidebar;
      },
      set(value) {
        this.$store.commit("updateSidebar", value);
      }
    }
  }
};
</script>
