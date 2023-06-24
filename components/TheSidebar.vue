<script lang="ts" setup>
const localePath = useLocalePath();
const { active, smallScreen } = useSidebarLayout();
</script>

<template>
  <v-navigation-drawer
    v-model="active"
    absolute
    v-bind="{
      temporary: smallScreen,
      permanent: !smallScreen,
    }"
    class="fixed bg-grey-darken-4"
    theme="dark"
  >
    <v-list>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        :to="localePath({ name: 'admin' })"
        :title="$t('sidebar.dashboard')"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-box"
        :title="$t('sidebar.users')"
      ></v-list-item>
      <v-list-item
        link
        prepend-icon="mdi-book"
        :to="localePath({ name: 'admin-blogs' })"
        :title="$t('sidebar.blogs')"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
