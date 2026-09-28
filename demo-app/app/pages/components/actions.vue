<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ArrowRight01Icon, Cursor01Icon, CreditCardIcon, Delete02Icon, Download01Icon, GridViewIcon, LeftToRightListBulletIcon, Logout01Icon, Menu01Icon, MoreHorizontalIcon, PlusSignIcon, Rocket01Icon, Settings02Icon, Share08Icon, Table01Icon, TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon, TextBoldIcon, TextItalicIcon, TextUnderlineIcon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '@brumaombra/ui-vintage/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@brumaombra/ui-vintage/dropdown-menu';
import { Kbd, KbdGroup } from '@brumaombra/ui-vintage/kbd';
import { showMessageToast } from '@brumaombra/ui-vintage/message-toast';
import { Toggle, ToggleGroup, ToggleGroupItem } from '@brumaombra/ui-vintage/toggle-group';
import DemoPageHeader from '~/components/demo/DemoPageHeader.vue';
import DemoSection from '~/components/demo/DemoSection.vue';

definePageMeta({ layout: 'dashboard' });

const deploying = ref(false);
const alignment = ref('left');
const view = ref('grid');
const formatting = ref<string[]>(['bold']);
const pinned = ref(true);
const showStatusBar = ref(true);
const showActivity = ref(false);
const density = ref('comfortable');
const pressedKeys = ref<string[]>([]);

// Simulate an async action with the loading state
const handleDeploy = async () => {
    deploying.value = true;
    await new Promise(resolve => setTimeout(resolve, 1600));
    deploying.value = false;
    showMessageToast({ title: 'Deployed to production', message: 'Build #1842 is live on all regions.', type: 'success' });
};

// Show which menu item was selected
const handleMenuSelect = (label: string) => {
    showMessageToast({ message: `"${label}" selected`, type: 'info', duration: 2500 });
};

// Mirror real keyboard presses on the keycaps
const handleKeydown = (event: KeyboardEvent) => {
    const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
    if (!pressedKeys.value.includes(key)) pressedKeys.value = [...pressedKeys.value, key].slice(-4);
};
const handleKeyup = (event: KeyboardEvent) => {
    const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
    window.setTimeout(() => {
        pressedKeys.value = pressedKeys.value.filter(item => item !== key);
    }, 120);
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
});
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('keyup', handleKeyup);
});

const buttonCode = `<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="green">Tone</Button>

<!-- Loading keeps the width stable and blocks clicks -->
<Button :loading="deploying" @click="deploy">
    <HugeiconsIcon :icon="Rocket01Icon" />
    Deploy
</Button>`;

const toggleCode = `<ToggleGroup v-model="view" type="single" highlight>
    <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
    <ToggleGroupItem value="list">List</ToggleGroupItem>
    <ToggleGroupItem value="table">Table</ToggleGroupItem>
</ToggleGroup>

<ToggleGroup v-model="formatting" type="multiple">
    <ToggleGroupItem value="bold" aria-label="Bold">...</ToggleGroupItem>
</ToggleGroup>`;

const dropdownCode = `<DropdownMenu>
    <DropdownMenuTrigger as-child>
        <Button variant="secondary">Account</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem>Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuCheckboxItem v-model="showStatusBar">Status bar</DropdownMenuCheckboxItem>
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>...</DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>`;

const kbdCode = `<KbdGroup :keys="['mod', 'shift', 'p']" />
<Kbd :pressed="isPressed">Esc</Kbd>`;
</script>

<template>
    <div class="flex flex-col gap-12">
        <DemoPageHeader eyebrow="Components" title="Actions" description="Buttons, segmented controls, menus, and keyboard hints. Every press has spring feedback, and every async action has a loading state." :icon="Cursor01Icon" />

        <!-- Button -->
        <DemoSection id="button" title="Button" badge="Updated" description="Spring press feedback, a sheen sweep on primary buttons, and a new loading prop that keeps the width stable." :code="buttonCode">
            <div class="flex flex-col gap-6">
                <!-- Variants -->
                <div class="flex flex-wrap items-center gap-3">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                </div>

                <!-- Tones -->
                <div class="flex flex-wrap items-center gap-3">
                    <Button variant="gray">Gray</Button>
                    <Button variant="green">Green</Button>
                    <Button variant="blue">Blue</Button>
                    <Button variant="yellow">Yellow</Button>
                    <Button variant="red">
                        <HugeiconsIcon :icon="Delete02Icon" />
                        Delete
                    </Button>
                </div>

                <!-- Sizes, icons, and states -->
                <div class="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="lg">
                        Large
                        <HugeiconsIcon :icon="ArrowRight01Icon" />
                    </Button>
                    <Button variant="secondary" size="icon" aria-label="Add">
                        <HugeiconsIcon :icon="PlusSignIcon" />
                    </Button>
                    <Button variant="secondary" size="icon-sm" aria-label="Download">
                        <HugeiconsIcon :icon="Download01Icon" />
                    </Button>
                    <Button variant="secondary" disabled>Disabled</Button>
                    <Button :loading="deploying" @click="handleDeploy">
                        <HugeiconsIcon :icon="Rocket01Icon" />
                        Deploy to production
                    </Button>
                </div>
            </div>
        </DemoSection>

        <!-- Toggle group -->
        <DemoSection id="toggle-group" title="Toggle group" badge="New" description="A segmented control with a spring-driven sliding indicator. Multiple mode and standalone toggles are included too." :code="toggleCode">
            <div class="flex flex-col gap-6">
                <div class="flex flex-wrap items-center gap-4">
                    <!-- View switcher -->
                    <ToggleGroup v-model="view" type="single" highlight>
                        <ToggleGroupItem value="grid">
                            <HugeiconsIcon :icon="GridViewIcon" />
                            Grid
                        </ToggleGroupItem>
                        <ToggleGroupItem value="list">
                            <HugeiconsIcon :icon="LeftToRightListBulletIcon" />
                            List
                        </ToggleGroupItem>
                        <ToggleGroupItem value="table">
                            <HugeiconsIcon :icon="Table01Icon" />
                            Table
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <!-- Alignment -->
                    <ToggleGroup v-model="alignment" type="single" size="sm">
                        <ToggleGroupItem value="left" aria-label="Align left">
                            <HugeiconsIcon :icon="TextAlignLeftIcon" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="center" aria-label="Align center">
                            <HugeiconsIcon :icon="TextAlignCenterIcon" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="right" aria-label="Align right">
                            <HugeiconsIcon :icon="TextAlignRightIcon" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div class="flex flex-wrap items-center gap-4">
                    <!-- Multiple formatting -->
                    <ToggleGroup v-model="formatting" type="multiple" size="sm">
                        <ToggleGroupItem value="bold" aria-label="Bold">
                            <HugeiconsIcon :icon="TextBoldIcon" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="italic" aria-label="Italic">
                            <HugeiconsIcon :icon="TextItalicIcon" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="underline" aria-label="Underline">
                            <HugeiconsIcon :icon="TextUnderlineIcon" />
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <!-- Standalone toggle -->
                    <Toggle v-model="pinned" variant="outline" aria-label="Pin sidebar">
                        <HugeiconsIcon :icon="Menu01Icon" />
                        {{ pinned ? 'Pinned' : 'Unpinned' }}
                    </Toggle>
                </div>

                <!-- Live result -->
                <p class="rounded border border-dashed border-border px-4 py-3 text-xs text-muted-foreground" :class="{ 'text-left': alignment === 'left', 'text-center': alignment === 'center', 'text-right': alignment === 'right', 'font-bold': formatting.includes('bold'), italic: formatting.includes('italic'), underline: formatting.includes('underline') }">
                    View: {{ view || 'none' }} · The quick brown fox jumps over the lazy dog.
                </p>
            </div>
        </DemoSection>

        <!-- Dropdown menu -->
        <DemoSection id="dropdown-menu" title="Dropdown menu" badge="New" description="Items stagger in from the trigger, icons nudge on highlight, and checkbox and radio indicators pop. Submenus included." :code="dropdownCode" preview-class="flex flex-wrap items-center justify-center gap-4 py-12!">
            <!-- Account menu -->
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="secondary">
                        <HugeiconsIcon :icon="UserIcon" />
                        My account
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-60">
                    <DropdownMenuLabel>Satoshi Nakamoto</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem @select="handleMenuSelect('Profile')">
                            <HugeiconsIcon :icon="UserIcon" />
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem @select="handleMenuSelect('Billing')">
                            <HugeiconsIcon :icon="CreditCardIcon" />
                            Billing
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem @select="handleMenuSelect('Settings')">
                            <HugeiconsIcon :icon="Settings02Icon" />
                            Settings
                            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <HugeiconsIcon :icon="Share08Icon" />
                            Share
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem @select="handleMenuSelect('Copy link')">Copy link</DropdownMenuItem>
                            <DropdownMenuItem @select="handleMenuSelect('Email')">Email</DropdownMenuItem>
                            <DropdownMenuItem @select="handleMenuSelect('Slack')">Slack</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" @select="handleMenuSelect('Log out')">
                        <HugeiconsIcon :icon="Logout01Icon" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <!-- View options menu -->
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="secondary" size="icon" aria-label="View options">
                        <HugeiconsIcon :icon="MoreHorizontalIcon" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-56">
                    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem v-model="showStatusBar">Status bar</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem v-model="showActivity">Activity panel</DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Density</DropdownMenuLabel>
                    <DropdownMenuRadioGroup v-model="density">
                        <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="spacious">Spacious</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </DemoSection>

        <!-- Kbd -->
        <DemoSection id="kbd" title="Kbd" badge="New" description="Keycaps for shortcuts. 'mod' resolves to ⌘ on macOS and Ctrl elsewhere. Try pressing keys: the caps below react live." :code="kbdCode">
            <div class="flex flex-col items-center gap-6 py-4">
                <div class="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                    <span class="flex items-center gap-2">Command palette <KbdGroup :keys="['mod', 'k']" /></span>
                    <span class="flex items-center gap-2">Toggle sidebar <KbdGroup :keys="['mod', 'b']" /></span>
                    <span class="flex items-center gap-2">Close <Kbd>Esc</Kbd></span>
                </div>

                <!-- Live keycaps -->
                <div class="flex min-h-12 items-center gap-2">
                    <TransitionGroup enter-active-class="transition-[opacity,scale] duration-300 ease-bounce" enter-from-class="opacity-0 scale-50" leave-active-class="transition-[opacity,scale] duration-150" leave-to-class="opacity-0 scale-75">
                        <Kbd v-for="key in pressedKeys" :key="key" pressed class="h-10 min-w-10 px-3 text-sm">{{ key === ' ' ? 'Space' : key }}</Kbd>
                    </TransitionGroup>
                    <span v-if="!pressedKeys.length" class="text-xs text-muted-foreground">Press any key…</span>
                </div>
            </div>
        </DemoSection>
    </div>
</template>