<script setup>
const props = defineProps({
  error: Object,
});

const handleBack = () => {
  const router = useRouter();
  router.back();
};
const handleHome = () => clearError({ redirect: '/' });
</script>

<template>
  <v-app>
    <NuxtLayout>
      <NuxtLoadingIndicator />

      <v-layout>
        <TheNavbar />
        <v-main class="bg-blue-grey-lighten-5">
          <v-container>
            <h1>{{ error.statusCode }}</h1>
            <p class="mb-4">{{ error.message || error.statusMessage }}</p>
            <div class="d-flex">
              <v-btn class="mr-3" @click="handleBack">Back</v-btn>
              <v-btn color="primary" @click="handleHome">Home</v-btn>
            </div>
          </v-container>
        </v-main>
      </v-layout>
    </NuxtLayout>
  </v-app>
</template>
