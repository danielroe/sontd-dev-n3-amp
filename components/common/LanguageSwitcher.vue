<script lang="ts" setup>
import { LocaleObject } from 'vue-i18n-routing';

const switchLocalePath = useSwitchLocalePath();
const { locales, setLocale } = useI18n();
</script>

<template>
  <v-btn>
    <v-icon icon="mdi-translate"></v-icon>
    <client-only>
      <v-menu activator="parent">
        <v-list>
          <v-list-item
            v-for="locale in (locales as LocaleObject[])"
            :key="locale.code"
            :to="switchLocalePath(locale.code)"
            link
            @click="() => setLocale(locale.code)"
          >
            {{ locale.name }}
          </v-list-item>
        </v-list>
      </v-menu>
    </client-only>
  </v-btn>
</template>
