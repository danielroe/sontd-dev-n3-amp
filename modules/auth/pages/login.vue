<script setup lang="ts">
definePageMeta({
  title: 'title.login',
  auth: 'guest',
  layout: 'empty',
});

const { credentials, pending, errorMsg, login, resetError } = useLogin({
  credentials: {
    email: '',
    password: '',
    remember_me: true,
  },
});

const status = useQuery<string | null>('status', { replace: true });
const isSessionExpired = computed(() => Number(status.value) === 440);
const isUnauthorized = computed(() => Number(status.value) === 401);
</script>

<template>
  <v-container>
    <v-row no-gutters class="min-h-screen align-center">
      <v-spacer></v-spacer>
      <v-col cols="12" sm="6" md="4" xl="3">
        <v-form ref="form" method="post" @submit.prevent="() => login()">
          <h1 class="text-center text-h4 mb-6">{{ $t('login.title') }}</h1>

          <transition name="fade">
            <v-alert
              v-if="errorMsg"
              key="error"
              variant="tonal"
              close-label="Close Alert"
              border="start"
              density="comfortable"
              color="red-darken-1"
              class="mb-6"
              closable
              @update:model-value="resetError()"
            >
              {{ errorMsg }}
            </v-alert>
            <v-alert
              v-else-if="isSessionExpired"
              key="expired"
              variant="tonal"
              close-label="Close Alert"
              border="start"
              density="comfortable"
              color="grey-darken-5"
              class="mb-6"
              closable
              @update:model-value="status = null"
            >
              {{ $t('login.session_expired') }}
            </v-alert>
            <v-alert
              v-else-if="isUnauthorized"
              key="unauthorized"
              variant="tonal"
              close-label="Close Alert"
              border="start"
              density="comfortable"
              color="yellow-darken-4"
              class="mb-6"
              closable
              @update:model-value="status = null"
            >
              {{ $t('login.unauthorized') }}
            </v-alert>
          </transition>

          <v-text-field
            v-model="credentials.email"
            :label="$t('login.email')"
          />
          <v-text-field
            v-model="credentials.password"
            type="password"
            :label="$t('login.password')"
          />

          <div class="text-center">
            <v-btn
              :loading="pending"
              :disabled="pending"
              type="submit"
              color="primary"
            >
              {{ $t('login.submit') }}
            </v-btn>
          </div>
        </v-form>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>
