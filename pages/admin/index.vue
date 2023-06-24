<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  auth: true,
});
</script>

<template>
  <div>
    <h1>{{ $t('dashboard.welcome') }}</h1>
  </div>
</template>
