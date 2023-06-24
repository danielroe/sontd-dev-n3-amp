<script lang="ts" setup>
import { storeToRefs } from 'pinia';

const localePath = useLocalePath();
const { t } = useI18n();

const { doLogout } = useLogout();
const { $auth } = useNuxtApp();
const authStore = storeToRefs($auth.store);
const { user } = authStore;

const { toggleActive } = useSidebarLayout();
</script>

<template>
  <v-app-bar :elevation="2" link class="fixed">
    <template #prepend>
      <nuxt-link
        to="/"
        class="font-weight-medium text-grey-darken-4 text-decoration-none"
      >
        Nuxt3 Starter
      </nuxt-link>
    </template>

    <template #append>
      <div class="d-block d-md-none">
        <v-btn @click="toggleActive">
          <v-icon icon="mdi-menu" size="36"></v-icon>
        </v-btn>
      </div>
      <div class="d-none d-md-block">
        <CommonLanguageSwitcher />
        <v-btn v-if="user" class="mx-2">
          <v-avatar color="#eee" size="36" class="mr-2">
            <v-img cover :src="user.avatar?.url" alt="Avatar" />
          </v-avatar>
          {{ user.name }}

          <client-only>
            <v-menu activator="parent">
              <v-list>
                <v-list-item :to="localePath('/profile')">{{
                  t('common.profile')
                }}</v-list-item>
                <v-list-item @click="doLogout">{{
                  t('common.logout')
                }}</v-list-item>
              </v-list>
            </v-menu>
          </client-only>
        </v-btn>
        <template v-else>
          <v-btn class="mr-2" :to="localePath('/login')">{{
            t('common.login')
          }}</v-btn>
          <v-btn class="mr-2" :to="localePath('/signup')">{{
            t('common.signup')
          }}</v-btn>
        </template>
      </div>
    </template>
  </v-app-bar>
</template>
