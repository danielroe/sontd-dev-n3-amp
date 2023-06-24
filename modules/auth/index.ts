import defu from 'defu';
import { defineNuxtModule, addPlugin } from '@nuxt/kit';
import { resolve, join } from 'pathe';
import { AuthOptions, AuthConfig } from './types';

declare module '@nuxt/schema' {
  interface ConfigSchema {
    publicRuntimeConfig?: {
      auth: AuthConfig;
    };
  }
  interface NuxtConfig {
    auth?: AuthOptions;
  }
  interface NuxtOptions {
    auth?: AuthOptions;
  }
}

export default defineNuxtModule({
  meta: {
    name: 'auth-module',
    configKey: 'auth',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    endpoints: {
      baseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      login: {
        url: '/login',
        method: 'POST',
        property: '',
      },
      logout: { url: '/logout', method: 'DELETE' },
      refresh: {
        url: '/refresh_tokens',
        method: 'POST',
        property: '',
      },
      user: {
        url: '/me',
        method: 'GET',
        property: '',
      },
      signup: { url: '/signup', method: 'POST' },
    },
    token: {
      headerName: 'Authorization',
      type: 'Bearer',
      property: 'token',
    },
    refreshToken: {
      paramName: 'token',
      property: 'refresh_token',
    },
    cookie: {
      ssl: false,
      maxAge: 365 * 24 * 60 * 60,
    },
    middleware: {
      global: true,
    },
    redirect: {
      login: '/login',
      logout: '/',
      home: '/',
    },
    rewriteRedirects: true,
    routes: {
      login: {
        name: 'login',
        file: resolve(__dirname, './pages/login.vue'),
        path: '/login',
      },
      // logout: {
      //   name: 'logout',
      //   path: '/logout',
      //   file: resolve(__dirname, './pages/logout.vue'),
      // },
    },
  },
  setup(moduleOptions, nuxt) {
    nuxt.options.runtimeConfig.public.auth = defu(
      nuxt.options.runtimeConfig.public.auth,
      { ...moduleOptions }
    );

    // Auto register components
    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: join(__dirname, 'components'),
      });
    });

    // Auto register composables
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(__dirname, './composables'));
    });

    // Auto register pages
    nuxt.hook('pages:extend', (pages) => {
      const { routes } = nuxt.options.runtimeConfig.public.auth;
      (Object.keys(routes) as Array<keyof typeof routes>).forEach((name) => {
        const route = routes[name];
        pages.push({ ...route, name: route.name || name });
      });
    });

    addPlugin(resolve(__dirname, './plugin.ts'));

    // Pinia store modules are auto imported
  },
});
