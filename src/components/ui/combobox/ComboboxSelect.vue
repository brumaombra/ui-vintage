<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { AcceptableValue } from 'reka-ui';
import { computed, ref } from 'vue';
import { Cancel01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { SelectItemContent } from '../select';
import Combobox from './Combobox.vue';
import ComboboxAnchor from './ComboboxAnchor.vue';
import ComboboxEmpty from './ComboboxEmpty.vue';
import ComboboxInput from './ComboboxInput.vue';
import ComboboxItem from './ComboboxItem.vue';
import ComboboxList from './ComboboxList.vue';
import ComboboxTrigger from './ComboboxTrigger.vue';
import type { ComboboxSelectModelValue, ComboboxSelectOption, ComboboxSelectValue } from './types';

// Props
const props = withDefaults(defineProps<{
    modelValue?: ComboboxSelectModelValue;
    options: ComboboxSelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    multiple?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'default';
    class?: HTMLAttributes['class'];
    contentClass?: HTMLAttributes['class'];
}>(), {
    modelValue: undefined,
    multiple: false,
    disabled: false,
    size: 'default'
});

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: ComboboxSelectModelValue];
}>();

const { t } = useI18n();

const open = ref(false);
const searchTerm = ref('');

// Only animate the leading icon swap after the first interaction (no pop on page load)
const interacted = ref(false);

// Localized fallbacks, overridable via props
const placeholderText = computed(() => props.placeholder ?? t('uiVintage.combobox.placeholder'));
const searchPlaceholderText = computed(() => props.searchPlaceholder ?? t('uiVintage.combobox.searchPlaceholder'));
const emptyLabel = computed(() => props.emptyText ?? t('uiVintage.combobox.empty'));

// Normalized selection
const selectedValues = computed<ComboboxSelectValue[]>(() => {
    if (Array.isArray(props.modelValue)) return props.modelValue;
    return props.modelValue == null ? [] : [props.modelValue];
});

// Lookup options by value
const optionMap = computed(() => new Map(props.options.map(option => [option.value, option])));

const selectedOptions = computed(() => selectedValues.value
    .map(value => optionMap.value.get(value))
    .filter((option): option is ComboboxSelectOption => !!option));

const selectedOption = computed(() => (props.multiple ? undefined : selectedOptions.value[0]));

// Value handed to reka (array in multiple mode)
const rootValue = computed<AcceptableValue | AcceptableValue[] | undefined>(() => {
    if (props.multiple) return selectedValues.value;
    return selectedValues.value[0];
});

// Label shown inside the input for single selection
const displayValue = (value: unknown) => {
    if (props.multiple || value == null || Array.isArray(value)) return '';
    return optionMap.value.get(value as ComboboxSelectValue)?.label ?? '';
};

// Placeholder switches to a search prompt (or the current label) while open
const inputPlaceholder = computed(() => {
    if (props.multiple) {
        if (open.value || selectedOptions.value.length) return searchPlaceholderText.value;
        return placeholderText.value;
    }
    if (open.value) return selectedOption.value?.label ?? searchPlaceholderText.value;
    return placeholderText.value;
});

// Leading icon mirrors the selected option icon when closed
const showsOptionIcon = computed(() => !open.value && !!selectedOption.value?.icon);
const leadingIcon = computed(() => (showsOptionIcon.value && selectedOption.value?.icon) || Search01Icon);

const handleUpdate = (value: unknown) => {
    if (props.multiple) {
        emits('update:modelValue', Array.isArray(value) ? [...value] as ComboboxSelectValue[] : []);
        return;
    }
    emits('update:modelValue', (value ?? null) as ComboboxSelectModelValue);
};

// Clear the text on open so the whole list is visible (single mode keeps the label as placeholder)
const handleOpenChange = (value: boolean) => {
    open.value = value;
    interacted.value = true;
    if (value) searchTerm.value = '';
};

// Remove a tag in multiple mode
const removeValue = (value: ComboboxSelectValue) => {
    if (props.disabled) return;
    emits('update:modelValue', selectedValues.value.filter(item => item !== value));
};

// Backspace on an empty input removes the last tag
const handleKeydown = (event: KeyboardEvent) => {
    if (!props.multiple || event.key !== 'Backspace' || searchTerm.value) return;
    const last = selectedValues.value[selectedValues.value.length - 1];
    if (last !== undefined) removeValue(last);
};
</script>

<template>
    <Combobox :model-value="rootValue" :multiple="props.multiple" :disabled="props.disabled" :open="open" data-slot="combobox-select" :class="cn('w-full', props.class)" @update:model-value="handleUpdate" @update:open="handleOpenChange">
        <!-- Field -->
        <ComboboxAnchor :size="props.size" :class="props.multiple && selectedOptions.length ? 'py-2' : undefined">
            <!-- Leading icon -->
            <HugeiconsIcon :key="showsOptionIcon ? `option-${selectedOption?.value}` : 'search'" :icon="leadingIcon" :class="cn('size-4', interacted && 'animate-uv-pop')" />

            <div class="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                <!-- Selected tags (multiple mode) -->
                <TransitionGroup v-if="props.multiple" leave-active-class="transition-[opacity,scale] duration-150 ease-snappy" leave-to-class="scale-75 opacity-0">
                    <span v-for="option in selectedOptions" :key="option.value" data-slot="combobox-select-tag" class="inline-flex h-7 max-w-full animate-uv-pop items-center gap-1 rounded-sm border border-border bg-surface pr-1 pl-2 text-[11px] font-semibold text-foreground sm:text-xs">
                        <HugeiconsIcon v-if="option.icon" :icon="option.icon" class="size-3" />
                        <span class="truncate">{{ option.label }}</span>
                        <button type="button" :disabled="props.disabled" :aria-label="`${t('uiVintage.buttons.remove')} ${option.label}`" class="flex size-5 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none transition-[color,background-color,scale] duration-150 ease-spring hover:bg-accent hover:text-destructive focus-visible:ring-[3px] focus-visible:ring-ring/45 active:scale-90 disabled:pointer-events-none" @click.stop="removeValue(option.value)">
                            <HugeiconsIcon :icon="Cancel01Icon" class="size-3" />
                        </button>
                    </span>
                </TransitionGroup>

                <!-- Search input -->
                <ComboboxInput v-model="searchTerm" :display-value="displayValue" :placeholder="inputPlaceholder" :disabled="props.disabled" @keydown="handleKeydown" />
            </div>

            <!-- Chevron trigger -->
            <ComboboxTrigger />
        </ComboboxAnchor>

        <!-- Options list -->
        <ComboboxList :class="props.contentClass">
            <ComboboxEmpty>{{ emptyLabel }}</ComboboxEmpty>

            <ComboboxItem v-for="option in props.options" :key="option.value" :value="option.value" :text-value="option.label" :disabled="option.disabled">
                <SelectItemContent :icon="option.icon" :label="option.label" :description="option.description" />
            </ComboboxItem>
        </ComboboxList>
    </Combobox>
</template>