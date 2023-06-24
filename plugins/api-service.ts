import { useApiService, ApiService } from '~~/services';

declare module '#app' {
  interface NuxtApp {
    $apiService: ApiService;
  }
}

declare module 'nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $apiService: ApiService;
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: useApiService(),
  };
});
