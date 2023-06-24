import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default defineNuxtPlugin((NuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    ssr: true,
    display: {
      mobileBreakpoint: 'sm',
    },
  });

  NuxtApp.vueApp.use(vuetify);
});
