<script lang="ts" setup></script>

<template>
  <v-card class="mx-auto" max-width="620">
    <CommonSkeletonLoading height="200px" :rounded="false" />

    <v-card-subtitle>
      <div class="d-flex justify-space-between mt-2">
        <CommonSkeletonLoading width="50%" />
        <CommonSkeletonLoading width="3rem" />
      </div>
    </v-card-subtitle>

    <v-card-text>
      <CommonSkeletonLoading height="1rem" class="mb-1" />
      <CommonSkeletonLoading height="1rem" class="mb-1" />
      <CommonSkeletonLoading height="1rem" />
    </v-card-text>
  </v-card>
</template>
