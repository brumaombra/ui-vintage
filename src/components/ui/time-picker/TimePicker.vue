<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, ref } from 'vue';
import CheckmarkCircle02Icon from '@hugeicons/core-free-icons/CheckmarkCircle02Icon';
import Clock01Icon from '@hugeicons/core-free-icons/Clock01Icon';
import { HugeiconsIcon } from '@hugeicons/vue';
import { useI18n } from 'vue-i18n';
import { Button } from '../button';
import PickerShell from '../date-picker/PickerShell.vue';
import { TimeWheel } from '../time-wheel';

// Props (the time as "HH:MM", the minutes offered every minuteStep)
const props = withDefaults(defineProps<{
	defaultValue?: string;
	modelValue?: string;
	minuteStep?: number;
	placeholder?: string;
	disabled?: boolean;
	class?: HTMLAttributes['class'];
	contentClass?: HTMLAttributes['class'];
}>(), {
	defaultValue: '',
	modelValue: undefined,
	minuteStep: 5,
	disabled: false
});

// Emits
const emits = defineEmits<{
	(e: 'update:modelValue', payload: string): void;
}>();

const { t } = useI18n();
const isOpen = ref(false);
const internalTime = ref(props.defaultValue);

// The time picked (from v-model, or kept inside when the picker is used without it); the wheels set it as they turn
const time = computed({
	get: () => (props.modelValue !== undefined ? props.modelValue : internalTime.value),
	set: (value: string) => {
		internalTime.value = value;
		emits('update:modelValue', value);
	}
});

const resolvedPlaceholder = computed(() => props.placeholder || t('uiVintage.timePicker.placeholder'));

// Open on the time picked, or on noon when there is none yet (so the wheels start on a value the field shows)
const handleOpen = (value: boolean) => {
	if (value && !time.value) time.value = '12:00';
	isOpen.value = value;
};
</script>

<template>
	<PickerShell :open="isOpen" :value-text="time" :placeholder="resolvedPlaceholder" :title="resolvedPlaceholder" :icon="Clock01Icon" :disabled="props.disabled" :class="['font-mono', props.class]" :content-class="props.contentClass" @update:open="handleOpen">
		<TimeWheel v-model="time" :minute-step="props.minuteStep" />
		<template #footer>
			<Button variant="primary" @click="isOpen = false">
				<HugeiconsIcon :icon="CheckmarkCircle02Icon" class="size-4" aria-hidden="true" />
				{{ t('uiVintage.buttons.confirm') }}
			</Button>
		</template>
	</PickerShell>
</template>