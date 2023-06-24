<script lang="ts" setup>
interface Props {
  height?: string;
  width?: string;
  inline?: boolean;
  rounded: boolean | string;
}

const props = withDefaults(defineProps<Props>(), {
  height: '1rem',
  width: '100%',
  inline: false,
  rounded: '0.25rem',
});

const borderRadius = computed(() => (props.rounded ? props.rounded : 0));
const display = computed(() => (props.inline ? 'inline-block' : 'block'));
</script>

<template>
  <div class="skeleton"></div>
</template>

<style lang="scss" scoped>
.skeleton {
  display: v-bind(display);
  height: v-bind(height);
  width: v-bind(width);
  border-radius: v-bind(borderRadius);
  position: relative;
  overflow: hidden;
  background-color: #dddbdd;
  cursor: wait;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.2) 20%,
      rgba(#fff, 0.5) 60%,
      rgba(#fff, 0)
    );
    animation: shimmer 2s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}
</style>
