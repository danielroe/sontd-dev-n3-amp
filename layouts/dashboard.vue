<script lang="ts" setup>
const route = useRoute();
const { t } = useI18n();

useHead({
  titleTemplate: (title) => {
    if (route.meta.title) {
      const partial = t(route.meta.title as string);
      return t('layouts.dashboard.title_template', { title: partial });
    }
    if (title) {
      return t('layouts.dashboard.title_template', { title });
    }
    return t('layouts.dashboard.title');
  },
});
</script>

<template>
  <v-layout>
    <v-no-ssr>
      <TheNavbar />
      <TheSidebar />
      <v-main class="bg-blue-grey-lighten-5">
        <v-container fluid><slot /></v-container>
      </v-main>
    </v-no-ssr>
  </v-layout>
</template>
