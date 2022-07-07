<template>
  <v-app>
    <!-- <v-main> -->
    <component :is="layout">
      <router-view />
    </component>
    <!-- </v-main> -->
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
import MainLayout from "@/layouts/MainLayout";
export default {
  name: "App",

  data: () => ({
    //
  }),
  computed: {
    layout() {
      return (this.$route.meta.layout || "main") + "-Layout";
    },
  },
  components: {
    MainLayout,
  },
  methods: {
    ...mapActions(["GET_CENTER_CONFIG"]),
  },
  // async mounted() {
  //   await this.GET_CENTER_CONFIG()
  // }
};
</script>
