<script setup lang="ts">
const { $apiService } = useNuxtApp();
const route = useRoute();
const id = computed(() => route.params.id as string);

const { data: blog } = useAsyncData(
  async () => {
    try {
      const { data } = await $apiService.blogs.show(id.value);
      useHead({ title: data.title });

      return data;
    } catch (error) {
      showError({ statusCode: 404, statusMessage: 'Blog does not exist' });
      return null;
    }
  },
  { watch: [id] }
);
</script>

<template>
  <div>
    <v-col
      cols="12"
      sm="8"
      offset-sm="2"
      md="6"
      offset-md="3"
      lg="4"
      offset-lg="4"
    >
      <h1>{{ blog?.title }}</h1>
      <p class="mb-4">{{ blog?.content }}</p>
      <img :src="blog?.image?.url" :alt="blog?.title" class="w-100" />
    </v-col>
  </div>
</template>
