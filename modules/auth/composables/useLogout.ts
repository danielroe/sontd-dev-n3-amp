import { RawLocation } from '@intlify/vue-router-bridge';

export const useLogout = (redirectPath: RawLocation = '/') => {
  const pending = ref(false);
  const errorMsg = ref('');
  const { $auth } = useNuxtApp();
  const {
    public: { auth: authConfig },
  } = useRuntimeConfig();

  const redirectRoute = authConfig.redirect.logout ?? redirectPath ?? '/';

  const doLogout = () => {
    return $auth
      .logout()
      .then(() => {
        redirectTo(redirectRoute);
      })
      .catch((error) => {
        errorMsg.value = error.data.message;
      })
      .finally(() => (pending.value = false));
  };

  return {
    errorMsg,
    pending,
    doLogout,
  };
};
