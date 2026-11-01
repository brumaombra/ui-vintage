<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, onMounted, ref } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { HugeiconsIcon } from '@hugeicons/vue';
import { cn } from '../../../lib/utils';
import { Button } from '../button';
import { useFieldControlId, useFieldLabelId } from '../field/field-context';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { ResponsiveDialog } from '../responsive-dialog';

// The field of the date and time pickers: it shows the value, and opens the picker in a popover under it on larger screens or in a sheet from the bottom on phones
const props = defineProps<{
	open: boolean;
	valueText: string;
	placeholder: string;
	title: string;
	icon: object;
	disabled?: boolean;
	class?: HTMLAttributes['class'];
	contentClass?: HTMLAttributes['class'];
}>();

// Emits
const emits = defineEmits<{
	(e: 'update:open', value: boolean): void;
}>();

// A popover once the page runs in the browser on a larger screen (the server and the first render use the sheet, so the page hydrates the same markup)
const isMounted = ref(false);
const isWideScreen = useMediaQuery('(min-width: 768px)');
const usePopover = computed(() => isMounted.value && isWideScreen.value);

// Let a surrounding Field label point to the field, and name it "label + value" so the value is not lost
const fieldControlId = useFieldControlId();
const fieldLabelId = useFieldLabelId();
const labelledBy = computed(() => (fieldLabelId.value && fieldControlId.value ? `${fieldLabelId.value} ${fieldControlId.value}` : undefined));

// Classes of the field
const fieldClass = computed(() => cn('h-13 w-full justify-start text-left font-normal enabled:active:scale-100', !props.valueText && 'text-muted-foreground', props.class));

// Open or close the picker
const setOpen = (value: boolean) => {
	emits('update:open', value);
};

// Switch to the popover once in the browser
onMounted(() => {
	isMounted.value = true;
});
</script>

<template>
	<!-- Larger screens: a popover under the field -->
	<Popover v-if="usePopover" :open="props.open" @update:open="setOpen">
		<PopoverTrigger as-child>
			<Button :id="fieldControlId" data-slot="picker-field" :aria-labelledby="labelledBy" variant="secondary" :disabled="props.disabled" :class="fieldClass">
				<HugeiconsIcon :icon="props.icon" class="size-4 shrink-0" aria-hidden="true" />
				<span class="truncate">{{ props.valueText || props.placeholder }}</span>
			</Button>
		</PopoverTrigger>
		<PopoverContent data-slot="picker-content" align="start" :class="cn('max-h-(--reka-popover-content-available-height) w-80 overflow-y-auto p-3', props.contentClass)">
			<slot />
			<div v-if="$slots.footer" class="mt-3 flex flex-row-reverse gap-2 border-t border-border pt-3">
				<slot name="footer" />
			</div>
		</PopoverContent>
	</Popover>

	<!-- Phones: the field opens a sheet from the bottom -->
	<template v-else>
		<Button :id="fieldControlId" data-slot="picker-field" :aria-labelledby="labelledBy" aria-haspopup="dialog" :aria-expanded="props.open" variant="secondary" :disabled="props.disabled" :class="fieldClass" @click="setOpen(true)">
			<HugeiconsIcon :icon="props.icon" class="size-4 shrink-0" aria-hidden="true" />
			<span class="truncate">{{ props.valueText || props.placeholder }}</span>
		</Button>
		<ResponsiveDialog :open="props.open" :title="props.title" :body-class="props.contentClass" @update:open="setOpen">
			<slot />
			<template v-if="$slots.footer" #footer>
				<slot name="footer" />
			</template>
		</ResponsiveDialog>
	</template>
</template>