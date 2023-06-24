<script lang="ts" setup>
import { useApiService } from '~~/services';

definePageMeta({
  title: 'title.admin_blogs',
  layout: 'dashboard',
  auth: true,
});

const { apiService } = useApiService();
const {
  data: { items: blogs },
} = await apiService.blogs.index();

async function showDetail(id: number) {
  const { data: blog } = await apiService.blogs.show(id);
  // eslint-disable-next-line no-alert
  alert(`${blog.id}. ${blog.title}\n${blog.content}`);
}
</script>

<template>
  <div>
    <v-list color="transparent">
      <v-list-item
        v-for="blog in blogs"
        :key="blog.id"
        :prepend-avatar="blog.image.url"
        :title="blog.title"
        :subtitle="blog.content"
        @click="showDetail(blog.id)"
      >
        <template #append>
          <v-btn
            color="blue-lighten-1"
            icon="mdi-file-edit-outline"
            variant="text"
            class="mr-2"
            @click.stop
          ></v-btn>
          <v-btn
            color="red-lighten-1"
            icon="mdi-delete-outline"
            variant="text"
            @click.stop
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>
