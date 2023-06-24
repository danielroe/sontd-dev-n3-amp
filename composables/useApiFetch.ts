import { NitroFetchRequest, NitroFetchOptions } from 'nitropack';
import { UnwrapRef } from 'vue';
import { ApiResponse } from '~~/types/api';
import { callWithNuxt } from '#app';

export type ApiFetchState = 'idle' | 'pending' | 'resolved' | 'error';
export type ApiFetchOptions = NitroFetchOptions<NitroFetchRequest> & {
  immediate?: boolean;
};
export type ExecuteOptions = NitroFetchOptions<NitroFetchRequest> & {
  reset?: boolean;
  resetData?: boolean;
  resetError?: boolean;
};
export type ApiFetchReturn<T> = {
  status: Ref<ApiFetchState>;
  data: Ref<ApiResponse<UnwrapRef<T>> | null>;
  error: Ref<any>;
  pending: Ref<boolean>;
  execute: (opts?: ExecuteOptions) => Promise<void>;
  refresh: (opts?: ExecuteOptions) => Promise<void>;
};

export function useApiFetch<T = any>(
  url: string,
  fetchOptions?: ApiFetchOptions
): ApiFetchReturn<T> | Promise<ApiFetchReturn<T>> {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const localePath = useLocalePath();
  const {
    fullPath: referer,
    meta: { auth: authMeta },
  } = route;

  const status = ref<ApiFetchState>('idle');
  const data = ref<ApiResponse<T> | null>(null);
  const error = ref();
  const pending = ref(false);

  const execute = async ({
    reset = false,
    resetData = false,
    resetError = false,
    ...executeOptions
  }: ExecuteOptions = {}) => {
    if (pending.value) return;

    pending.value = true;
    status.value = 'pending';

    if (resetData || reset) {
      data.value = null;
    }
    if (resetError || reset) {
      error.value = null;
    }

    try {
      const resp = await $fetch<ApiResponse<T>>(url, {
        baseURL: config.public.apiBase,

        headers: {
          ...fetchOptions?.headers,
        },

        onRequest: ({ options }) => {
          if (nuxtApp.$auth.accessToken) {
            const { headerName, type } = config.public.auth.token;
            options.headers = (options.headers || {}) as Record<string, string>;
            options.headers[
              headerName
            ] = `${type} ${nuxtApp.$auth.accessToken}`;
          }
        },

        onResponseError: async (context) => {
          const { response, request } = context;
          const isUnauthorized = response.status === 401;
          if (!isUnauthorized) return;

          const { url: refreshEndpoint } = config.public.auth.endpoints.refresh;
          const isRefreshFailed = request.toString().includes(refreshEndpoint);

          if (!nuxtApp.$auth.refreshToken || isRefreshFailed) {
            nuxtApp.$auth.logout(false);
            if (authMeta !== 'guest') {
              nuxtApp.$auth.setReferer(referer);
            }
            const loginPath = localePath({
              name: 'login',
              query: { code: '401', tokens_expired: String(isRefreshFailed) },
            });
            await callWithNuxt(nuxtApp, redirectTo, [loginPath]);
            return;
          }

          await nuxtApp.$auth.refreshTokens();
          const res: any = await execute();
          context.response = res;
        },

        ...fetchOptions,
        ...executeOptions,
      });
      data.value = resp as ApiResponse<UnwrapRef<T>>;
      status.value = 'resolved';
    } catch (err) {
      error.value = err;
      status.value = 'error';
    } finally {
      pending.value = false;
    }
  };

  if (fetchOptions?.immediate) {
    return execute().then(() => ({
      status,
      data,
      error,
      pending,
      execute,
      refresh: execute,
    }));
  }

  return Promise.resolve({
    status,
    data,
    error,
    pending,
    execute,
    refresh: execute,
  });
}
