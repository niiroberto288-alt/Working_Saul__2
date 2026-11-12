<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '1rem' },
  rounded: { type: String, default: '0.75rem' },
  label: { type: String, default: 'Loading content' },
})
</script>

<template>
  <div
    class="skeleton"
    role="status"
    :aria-label="label"
    :style="{ width, height, borderRadius: rounded }"
  />
</template>
