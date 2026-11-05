<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';
import { useEventListener } from '@vueuse/core';
import type { HugeiconsIconDefinition } from '../../lib/common-types';
import { RadioGroup, RadioGroupCard } from '../ui/radio-group';
import { ResponsiveDialog } from '../ui/responsive-dialog';

// One option of the picker
export interface OptionPickerOption {
	value: AcceptableValue;
	label: string;
	description?: string;
	icon?: HugeiconsIconDefinition;
	disabled?: boolean;
}

// Props (open: whether the picker shows; modelValue: the picked option)
const props = withDefaults(defineProps<{
	open?: boolean;
	title: string;
	description?: string;
	options: OptionPickerOption[];
	modelValue?: AcceptableValue;
}>(), {
	open: false,
	description: '',
	modelValue: undefined
});

// Emits
const emits = defineEmits<{
	'update:open': [open: boolean];
	'update:modelValue': [value: AcceptableValue];
}>();

// Slots (icon: your own visual for an option instead of its icon tile, such as a flag or a logo)
defineSlots<{
	icon?: (props: { option: OptionPickerOption }) => unknown;
}>();

// Arrow keys move through the options: while one is held, the radio group checks the option it reaches by clicking it (like Reka's RadioGroupItem), so those clicks must not close the picker
const ARROW_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
let isArrowKeyPressed = false;

// Pick an option as soon as it's checked (by a tap, the space key or the arrow keys)
const handleChange = (value: AcceptableValue) => {
	if (value !== props.modelValue) emits('update:modelValue', value);
};

// Note when an arrow key is held, until it's released (the same window in which the radio group clicks)
useEventListener('keydown', (event: KeyboardEvent) => {
	if (ARROW_KEYS.has(event.key)) isArrowKeyPressed = true;
});
useEventListener('keyup', () => {
	isArrowKeyPressed = false;
});

// Close the picker on a tap, a click or the space key on an option (a tap on the current one just closes), but not while the arrow keys move through the list
const handleOptionClick = () => {
	if (isArrowKeyPressed) return;
	emits('update:open', false);
};
</script>

<template>
	<ResponsiveDialog :open="props.open" :title="props.title" :description="props.description" @update:open="open => emits('update:open', open)">
		<!-- The options as radio cards, the current one checked (a sheet on phones, a dialog on larger screens) -->
		<RadioGroup :model-value="props.modelValue" :aria-label="props.title" @update:model-value="handleChange">
			<RadioGroupCard v-for="option in props.options"
				:key="String(option.value)"
				:value="option.value"
				:label="option.label"
				:description="option.description"
				:icon="option.icon"
				:disabled="option.disabled"
				@click="handleOptionClick">
				<template v-if="$slots.icon" #icon>
					<slot name="icon" :option="option" />
				</template>
			</RadioGroupCard>
		</RadioGroup>
	</ResponsiveDialog>
</template>