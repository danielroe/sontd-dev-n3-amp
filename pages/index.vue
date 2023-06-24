<script setup lang="ts">
import { ApiFetchReturn } from '~~/composables/useApiFetch';
import { ApiPagination } from '~~/types/api';

definePageMeta({
  title: 'title.home',
  auth: false,
});

const { $apiService } = useNuxtApp();

const { query } = useRoute();
const pagination = ref(initPagination({ page: query.page }));

const page = computed({
  get() {
    return pagination.value?.page;
  },
  set(_page: number) {
    pagination.value.page = _page;
    const router = useRouter();
    const route = useRoute();

    router.push({ ...route, query: { ...route.query, page: _page } });
  },
});

const { pending, data: blogs } = useLazyAsyncData(
  async () => {
    const { data } = await $apiService.blogs.index({
      page: pagination.value.page,
    });
    return data.value?.data.items;
  },
  { watch: [page] }
);

const params = () => ({ t: Math.random() });

const {
  data,
  pending: pendingCheck,
  execute: check,
} = await $apiService.blogs.index({}, { immediate: false });

async function onCheck() {
  await check({ query: params() });
  // eslint-disable-next-line
  alert(data.value);
}
</script>

<template>
  <div>
    <v-btn color="primary" @click="onCheck">
      <span v-if="pendingCheck">Checking...</span>
      <span v-else>Check</span>
    </v-btn>
    <v-row v-if="pending">
      <v-col v-for="i in blogs?.length || 12" :key="i" cols="12" sm="6" lg="3">
        <HomeBlogCardSkeleton />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="blog in blogs" :key="blog.id" cols="12" sm="6" lg="3">
        <LazyHomeBlogCard :blog="blog" class="h-100"></LazyHomeBlogCard>
      </v-col>
    </v-row>
    <v-row>
      <div class="d-flex flex-grow-1 justify-center">
        <v-pagination
          v-model="page"
          :length="2"
          :total-visible="5"
          show-first-last-page
        />
      </div>
    </v-row>
  </div>
</template>
