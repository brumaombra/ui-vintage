<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from 'reka-ui';
import { haptic as playHaptic } from '../../../lib/haptics';
import { cn } from '../../../lib/utils';
import { useFieldControlId } from '../field/field-context';

// Props (haptic: a light tap on phones each time the user flips it)
const props = withDefaults(defineProps<SwitchRootProps & {
	haptic?: boolean;
	class?: HTMLAttributes['class'];
}>(), {
	haptic: true
});

// Emits
const emits = defineEmits<SwitchRootEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'haptic');
const forwarded = useForwardPropsEmits(delegatedProps, emits);

// Play the tap of a flip (within the user's tap, so iOS plays it too)
const handleToggle = () => {
	if (props.haptic) playHaptic('tap');
};

// Let a surrounding Field label point to this control
const fieldControlId = useFieldControlId(() => props.id);
</script>

<template>
	<SwitchRoot v-slot="slotProps" data-slot="switch" v-bind="forwarded" :id="fieldControlId" :class="cn(
		'group/switch peer relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded border border-input bg-secondary shadow-elevated-sm outline-none',
		'[transition:background-color_200ms,border-color_200ms,box-shadow_250ms] hover:border-border-strong focus-visible:ring-[3px] focus-visible:ring-ring/45 disabled:cursor-not-allowed disabled:opacity-60',
		'data-[state=checked]:border-primary data-[state=checked]:bg-accent',
		props.class
	)" @update:model-value="handleToggle">
		<SwitchThumb data-slot="switch-thumb" :class="cn(
			'pointer-events-none absolute left-1 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded bg-muted-foreground ring-0',
			'[transition:translate_380ms_var(--ease-spring),width_220ms_var(--ease-spring),background-color_200ms]',
			'group-active/switch:w-5 data-[state=checked]:translate-x-6 data-[state=checked]:bg-primary group-active/switch:data-[state=checked]:translate-x-5'
		)">
			<slot name="thumb" v-bind="slotProps" />
		</SwitchThumb>
	</SwitchRoot>
</template>