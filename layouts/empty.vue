<script lang="ts" setup>
const route = useRoute();
const { t } = useI18n();

useHead({
  titleTemplate: (title) => {
    if (route.meta.title) {
      const partial = t(route.meta.title as string);
      return t('layouts.default.title_template', { title: partial });
    }
    if (title) {
      return t('layouts.default.title_template', { title });
    }
    return t('layouts.default.title');
  },
});
</script>

<template>
  <v-layout>
    <v-main>
      <v-container><slot /></v-container>
    </v-main>
  </v-layout>
</template>
