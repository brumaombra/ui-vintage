<script setup lang="ts">
import type { ListboxGroupProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { ListboxGroup, ListboxGroupLabel, useId } from "reka-ui"
import { computed, onMounted, onUnmounted } from "vue"
import { cn } from "@/lib/utils"
import { provideCommandGroupContext, useCommand } from "."

const props = defineProps<ListboxGroupProps & {
  class?: HTMLAttributes["class"]
  heading?: string
}>()

const delegatedProps = reactiveOmit(props, "class")

const { allGroups, filterState } = useCommand()
const id = useId()

const isRender = computed(() => !filterState.search ? true : filterState.filtered.groups.has(id))

provideCommandGroupContext({ id })
onMounted(() => {
  if (!allGroups.value.has(id))
    allGroups.value.set(id, new Set())
})
onUnmounted(() => {
  allGroups.value.delete(id)
})
</script>

<template>
  <ListboxGroup
    v-bind="delegatedProps"
    :id="id"
    data-slot="command-group"
    :class="cn('text-foreground overflow-hidden', props.class)"
    :hidden="isRender ? undefined : true"
  >
    <ListboxGroupLabel v-if="heading" data-slot="command-group-heading" class="border-b border-(--border-light) px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--text-secondary-light) dark:border-(--border-dark) dark:text-(--text-secondary-dark)">
      {{ heading }}
    </ListboxGroupLabel>
    <div class="p-2">
      <slot />
    </div>
  </ListboxGroup>
</template>
