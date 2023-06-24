/* eslint-disable consistent-return */
import type { RouteLocationNormalized } from 'vue-router';
import { callWithNuxt } from '#app';
import { useLocalizeRoute } from '../composables/useLocalizeRoute';

export default async function authMiddleware(to: RouteLocationNormalized) {
  const nuxtApp = useNuxtApp();
  const { auth: authMeta } = to.meta;
  const { $auth } = nuxtApp;
  const {
    public: { auth: authConfig },
  } = useRuntimeConfig();
  const localizeRoute = useLocalizeRoute();

  const loginPath = authConfig.redirect.login ?? '/login';
  const loginRoute = localizeRoute({
    path: loginPath,
    query: { status: 'unauthorized' },
  });
  const logoutPath = authConfig.redirect.logout ?? '/';

  const isLoggedIn = $auth.hasTokens;
  const isGuestAuth = authMeta === 'guest';
  const isAuthDefined = authMeta && !isLoggedIn;
  const shouldSetReferer = String(authMeta) !== 'guest' && isLoggedIn;
  const isCurrentRouteLogin = String(to.name) === String(loginRoute?.name);

  if (isLoggedIn && !$auth.isPersistent) {
    $auth.logout(false);
    return redirectTo(to);
  }

  if (isGuestAuth) {
    if (isLoggedIn) {
      return redirectTo(logoutPath);
    }
    return;
  }

  if (isLoggedIn) {
    const refreshAccessToken = async () => {
      if ($auth.isSessionExpired) await $auth.refreshTokens();
    };
    const fetchUser = async () => {
      if (!$auth.user.value) await $auth.fetchUser();
    };

    try {
      await refreshAccessToken();
      await fetchUser();
    } catch (error) {
      if (shouldSetReferer) $auth.setReferer(to.fullPath);
      $auth.logout(false);
      return callWithNuxt(nuxtApp, navigateTo, [
        localizeRoute({
          path: loginPath,
          query: { status: 'session-expired' },
        }).fullPath,
      ]);
    }
  }

  if (isAuthDefined && !isCurrentRouteLogin) {
    $auth.setReferer(to.fullPath);
    return callWithNuxt(nuxtApp, navigateTo, [loginRoute.fullPath]);
  }
}
