const active = ref(true);
const smallScreen = ref(false);

export function useSidebarLayout({ breakpoint = 960 } = {}) {
  onBeforeMount(() => {
    trackScreenSize();

    if (smallScreen.value) {
      active.value = false;
    }

    window.addEventListener('resize', trackScreenSize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', trackScreenSize);
  });

  function trackScreenSize() {
    smallScreen.value = window.innerWidth < breakpoint;
  }

  function toggleActive() {
    active.value = !active.value;
  }

  return {
    toggleActive,
    active,
    smallScreen,
  };
}
