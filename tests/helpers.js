import { createRouter, createMemoryHistory } from 'vue-router'
import { defineComponent, h } from 'vue'

const Blank = defineComponent({
  name: 'BlankView',
  render: () => h('div'),
})

/** Minimal router for mounting components that use RouterLink. */
export function makeRouter(routes = [{ path: '/', name: 'home', component: Blank }]) {
  return createRouter({
    history: createMemoryHistory(),
    routes: [...routes, { path: '/:pathMatch(.*)*', name: 'not-found', component: Blank }],
  })
}
