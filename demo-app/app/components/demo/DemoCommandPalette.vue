<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { ArrowRight01Icon, Moon01Icon, Notification01Icon, Sun01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@brumaombra/ui-vintage/command';
import { KbdGroup } from '@brumaombra/ui-vintage/kbd';
import { showMessageToast } from '@brumaombra/ui-vintage/message-toast';
import { applyThemeWithTransition } from '@brumaombra/ui-vintage/theme-selector';
import { demoNavigation } from '~/utils/demo-navigation';

const open = defineModel<boolean>('open', { default: false });
const localePath = useLocalePath();

// Toggle the palette with Ctrl/Cmd + K
const handleKeydown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        open.value = !open.value;
    }
};

// Navigate to a page section (in the current locale)
const handleNavigate = async (path: string, sectionId?: string) => {
    open.value = false;
    const localizedPath = localePath(path);
    await navigateTo(sectionId ? { path: localizedPath, hash: `#${sectionId}` } : localizedPath);
};

// Switch theme with the circular reveal from the center of the screen
const handleTheme = (theme: 'light' | 'dark') => {
    open.value = false;
    void applyThemeWithTransition(theme, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
};

// Fire a sample toast
const handleToast = () => {
    open.value = false;
    showMessageToast({ title: 'Command executed', message: 'Toasts can be triggered from anywhere, even the command palette.', type: 'info' });
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
    <CommandDialog v-model:open="open" title="Search the docs" description="Jump to any component or run a quick action.">
        <CommandInput placeholder="Search components, sections, actions..." />
        <CommandList class="max-h-[min(60vh,420px)]">
            <CommandEmpty>
                <div class="text-muted-foreground">No matches. Try "table" or "toast".</div>
            </CommandEmpty>

            <!-- Pages and sections -->
            <template v-for="group in demoNavigation" :key="group.id">
                <CommandGroup v-for="page in group.items" :key="page.id" :heading="page.label">
                    <CommandItem :value="`${page.label} page ${page.description}`" @select="handleNavigate(page.to)">
                        <HugeiconsIcon :icon="page.icon" />
                        <span class="flex-1">{{ page.label }}</span>
                        <span class="text-[11px] font-normal text-muted-foreground">{{ page.description }}</span>
                    </CommandItem>
                    <CommandItem v-for="section in page.sections" :key="section.id" :value="`${page.label} ${section.title} ${section.keywords ?? ''}`" @select="handleNavigate(page.to, section.id)">
                        <HugeiconsIcon :icon="ArrowRight01Icon" class="opacity-50" />
                        <span class="flex-1">{{ section.title }}</span>
                    </CommandItem>
                </CommandGroup>
            </template>

            <CommandSeparator />

            <!-- Quick actions -->
            <CommandGroup heading="Actions">
                <CommandItem value="theme light mode" @select="handleTheme('light')">
                    <HugeiconsIcon :icon="Sun01Icon" />
                    <span class="flex-1">Switch to light theme</span>
                </CommandItem>
                <CommandItem value="theme dark mode" @select="handleTheme('dark')">
                    <HugeiconsIcon :icon="Moon01Icon" />
                    <span class="flex-1">Switch to dark theme</span>
                </CommandItem>
                <CommandItem value="toast notification test" @select="handleToast">
                    <HugeiconsIcon :icon="Notification01Icon" />
                    <span class="flex-1">Show a toast</span>
                </CommandItem>
            </CommandGroup>
        </CommandList>

        <!-- Footer hints -->
        <div class="flex items-center justify-between gap-3 border-t border-border bg-surface/60 px-4 py-2.5 text-[11px] text-muted-foreground">
            <span class="flex items-center gap-1.5"><KbdGroup :keys="['enter']" /> to select</span>
            <span class="flex items-center gap-1.5"><KbdGroup :keys="['mod', 'k']" /> to toggle</span>
        </div>
    </CommandDialog>
</template>