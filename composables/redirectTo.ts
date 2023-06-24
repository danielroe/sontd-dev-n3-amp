import { RawLocation, RouteLocation } from '@intlify/vue-router-bridge';
import { NavigateToOptions } from 'nuxt/dist/app/composables/router';

export default function redirectTo(
  to: RawLocation | RouteLocation,
  options: NavigateToOptions & { localize: boolean } = { localize: true }
) {
  const localePath = useLocalePath();
  const route = options.localize ? localePath(to) : to;

  return navigateTo(localePath(route), options);
}
