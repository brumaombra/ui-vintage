<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LanguageFlag } from '@/components/language-flag';

export interface LanguageSelectorOption {
    code: string;
    label: string;
    flagCode?: string;
}

// Props
const props = defineProps({
    modelValue: { type: String, default: '' },
    languages: {
        type: Array as PropType<LanguageSelectorOption[]>,
        default: () => []
    }
});

// Emits
const emits = defineEmits<{
    'update:modelValue': [value: string];
    select: [value: string];
}>();

const { t } = useI18n();
const isOpen = ref(false);

// Normalize languages to ensure flagCode is always available
const normalizedLanguages = computed(() => {
    return props.languages.map(language => ({
        code: language.code,
        label: language.label,
        flagCode: language.flagCode || language.code
    }));
});

// Get the currently selected language based on modelValue
const currentLanguage = computed(() => {
    return normalizedLanguages.value.find(language => language.code === props.modelValue) || normalizedLanguages.value[0] || null;
});

// Handle language selection
const handleSelectLanguage = (language: string) => {
    emits('update:modelValue', language);
    emits('select', language);
    isOpen.value = false;
};
</script>

<template>
    <Popover v-model:open="isOpen">
        <!-- Trigger button showing the current language flag -->
        <PopoverTrigger as-child>
            <Button variant="secondary" size="icon" :aria-label="t('ui.language.ariaLabel')">
                <LanguageFlag v-if="currentLanguage" :code="currentLanguage.flagCode" class="h-4 w-[1.35rem] rounded-[2px]" />
            </Button>
        </PopoverTrigger>

        <!-- Popover content with language options -->
        <PopoverContent side="bottom" align="end" :side-offset="8" class="w-44 !p-0">
            <Command :model-value="props.modelValue">
                <CommandList>
                    <CommandGroup :heading="t('ui.language.title')">
                        <CommandItem v-for="option in normalizedLanguages" :key="option.code" :value="option.code" @select="handleSelectLanguage(option.code)">
                            <LanguageFlag :code="option.flagCode" class="h-4 w-[1.35rem] rounded-[2px]" />
                            <span class="flex-1">{{ option.label }}</span>
                            <HugeiconsIcon :icon="Tick02Icon" class="ml-auto size-4 shrink-0" :class="props.modelValue === option.code ? 'opacity-100' : 'opacity-0'" />
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>