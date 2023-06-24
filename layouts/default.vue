<script lang="ts" setup>
const route = useRoute();
const { t } = useI18n();
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true,
});

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
  <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir">
    <Head>
      <template v-for="link in head.link" :key="link.id">
        <Link
          :id="link.id"
          :rel="link.rel"
          :href="link.href"
          :hreflang="link.hreflang"
        />
      </template>
      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>
    <Body>
      <v-layout>
        <TheNavbar />
        <v-main class="bg-blue-grey-lighten-5">
          <v-container>
            <slot />
          </v-container>
        </v-main>
      </v-layout>
    </Body>
  </Html>
</template>
