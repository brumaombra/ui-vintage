<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { BadgeVariants } from "."
import { Primitive } from "reka-ui"
import { cn } from "@/lib/utils"
import { badgeVariants } from "."

interface Props extends PrimitiveProps {
  variant?: BadgeVariants["variant"]
  class?: HTMLAttributes["class"]
}

const props = defineProps<Props>()
</script>

<template>
  <Primitive data-slot="badge" :data-variant="variant" :as="as" :as-child="asChild" :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </Primitive>
</template>