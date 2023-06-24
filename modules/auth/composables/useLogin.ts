import { RawLocation } from '@intlify/vue-router-bridge';

export interface UseLoginOptions {
  redirectPath?: RawLocation;
  credentials?: any;
}

export const useLogin = ({
  redirectPath: referer = '/',
  credentials: initials,
}: UseLoginOptions = {}) => {
  const { $auth } = useNuxtApp();
  const credentials = ref({ ...initials });
  const pending = ref(false);
  const error = ref<any>(null);

  const errorMsg = computed(() =>
    error.value ? 'Invalid login credentials' || 'An error has occurred!' : null
  );

  const resetError = () => {
    error.value = null;
  };

  const invalid = computed(() => {
    return Object.keys(credentials.value as object).some(
      (entry) => String((credentials.value as any)[entry] ?? '') === ''
    );
  });

  const login = (params?: Record<string, unknown>) => {
    if (invalid.value) {
      error.value = true;
      return Promise.resolve();
    }

    pending.value = true;
    const redirectPath = $auth.redirectPath || referer || '/';
    resetError();
    return $auth
      .login(params || (credentials.value as Record<string, unknown>))
      .then(async (res) => {
        await redirectTo(redirectPath);
        return res;
      })
      .catch((_error) => {
        error.value = _error;
      })
      .finally(() => (pending.value = false));
  };

  return {
    credentials,
    errorMsg,
    error,
    pending,
    resetError,
    login,
  };
};
