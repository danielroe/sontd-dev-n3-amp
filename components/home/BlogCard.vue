<script lang="ts" setup>
import { PropType } from 'vue';
import { Blog } from '~~/types/Blog';

defineProps({
  blog: {
    type: Object as PropType<Blog>,
    required: true,
  },
});

const localeRoute = useLocaleRoute();
</script>

<template>
  <v-card
    :to="localeRoute({ name: 'blogs-id', params: { id: blog.id } })"
    class="mx-auto"
    max-width="620"
  >
    <v-img :src="blog.image.url" height="200px" cover>
      <v-card-title>{{ blog.title }}</v-card-title>
    </v-img>

    <v-card-subtitle>
      <div class="d-flex justify-space-between mt-2">
        <span class="mr-4">
          {{ new Date(blog.created_at).toLocaleString() }}
        </span>
        <span>
          <v-icon class="mr-1" icon="mdi-comment"></v-icon>
          <span class="subheading">{{ blog.comments_count }}</span>
        </span>
      </div>
    </v-card-subtitle>

    <v-card-text>{{ blog.content }}</v-card-text>
  </v-card>
</template>
