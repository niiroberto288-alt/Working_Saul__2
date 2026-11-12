<script setup>
import { computed } from 'vue'
import { useTypewriter } from '@/composables/useTypewriter'
import ProgressBar from '@/components/ProgressBar.vue'
import { strings } from '@/assets/strings'

const props = defineProps({
  supervisor: { type: Object, required: true },
})

const { output, isTyping, play, reset } = useTypewriter(props.supervisor.quote)

const utilisation = computed(() =>
  Math.round((props.supervisor.caseload / props.supervisor.capacity) * 100)
)

function start() {
  play()
}

function stop() {
  if (!isTyping.value) reset()
}
</script>

<template>
  <article class="card card-hairline card-hover group overflow-hidden p-0">
    <div class="relative">
      <img
        :src="supervisor.photo"
        :alt="`Portrait of ${supervisor.name}`"
        width="560"
        height="680"
        loading="lazy"
        decoding="async"
        class="h-56 w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        aria-hidden="true"
      />
      <p
        class="absolute bottom-3 left-4 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-white/85"
      >
        {{ supervisor.faculty }}
      </p>
    </div>

    <div class="p-5">
      <h3 class="font-serif text-xl leading-tight text-ink">{{ supervisor.name }}</h3>
      <p class="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-accent">
        {{ supervisor.role }}
      </p>
      <p class="mt-3 text-[0.86rem] leading-relaxed text-ink-soft">{{ supervisor.specialty }}</p>

      <div
        class="mt-5 rounded-xl border border-line bg-primary/[0.03] p-3.5"
        tabindex="0"
        role="group"
        :aria-label="strings.home.whyISupervise"
        @mouseenter="start"
        @mouseleave="stop"
        @focus="start"
        @blur="stop"
        @click="start"
      >
        <p class="mono-label">{{ strings.home.whyISupervise }}</p>
        <p class="mt-2 min-h-[4.5rem] font-serif text-[0.98rem] italic leading-snug text-ink">
          <template v-if="output">{{ output }}</template>
          <span v-else class="text-ink-soft">{{ strings.home.hoverToRead }}</span>
          <span
            v-if="isTyping"
            class="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-accent align-middle"
            aria-hidden="true"
          />
        </p>
      </div>

      <p class="sr-only">{{ supervisor.quote }}</p>

      <div class="mt-5">
        <ProgressBar
          :label="strings.home.caseload"
          :value="utilisation"
          :show-value="false"
          size="sm"
        />
        <p class="mt-1.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ink-soft">
          {{ supervisor.caseload }} / {{ supervisor.capacity }} {{ strings.home.students }}
        </p>
      </div>
    </div>
  </article>
</template>
