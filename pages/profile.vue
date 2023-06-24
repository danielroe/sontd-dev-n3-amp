<script lang="ts" setup>
definePageMeta({
  title: 'title.login',
  auth: true,
  layout: 'default',
});

const { $auth } = useNuxtApp();
const { user } = $auth;
</script>

<template>
  <div>
    <v-row>
      <v-col cols="2">
        <v-img :src="user!.avatar.url" alt="Avatar" cover></v-img>
      </v-col>
      <v-col cols="10">
        <h1>{{ user!.name }}</h1>
        <p>{{ user!.email }}</p>
      </v-col>
    </v-row>
  </div>
</template>
