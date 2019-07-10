<template>
  <div>
    <!-- <sidebar/> -->
    <navbar />
    <app-main />
    <footer-main />
  </div>
</template>

<script>
// import { Sidebar, Navbar, AppMain, FooterMain } from "./components";
import { Navbar, AppMain, FooterMain } from "./components";

export default {
  name: "Layout",
  components: {
    // Sidebar,
    Navbar,
    AppMain,
    FooterMain
  }
};
</script>
