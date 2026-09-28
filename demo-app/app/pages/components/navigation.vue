<script setup lang="ts">
import { ref } from 'vue';
import { ArrowDown01Icon, ChartLineData02Icon, CreditCardIcon, Folder01Icon, Home01Icon, Navigation03Icon, Settings02Icon, ShieldUserIcon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Accordion } from '@brumaombra/ui-vintage/accordion';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@brumaombra/ui-vintage/breadcrumb';
import { Button } from '@brumaombra/ui-vintage/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@brumaombra/ui-vintage/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@brumaombra/ui-vintage/dropdown-menu';
import { SimplePagination } from '@brumaombra/ui-vintage/pagination';
import { SimpleStepper } from '@brumaombra/ui-vintage/stepper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brumaombra/ui-vintage/tabs';
import DemoPageHeader from '~/components/demo/DemoPageHeader.vue';
import DemoSection from '~/components/demo/DemoSection.vue';

definePageMeta({ layout: 'dashboard' });

// Stepper
const step = ref(2);
const verticalStep = ref(2);
const steps = [
    { title: 'Account', description: 'Create your login', icon: UserIcon },
    { title: 'Workspace', description: 'Name your team', icon: Folder01Icon },
    { title: 'Billing', description: 'Pick a plan', icon: CreditCardIcon },
    { title: 'Launch', description: 'Invite teammates', icon: ChartLineData02Icon }
];

// Pagination
const page = ref(4);

// Collapsible
const reposOpen = ref(false);
const repositories = ['nuxt/nuxt', 'vuejs/core', 'unovue/reka-ui', 'tailwindlabs/tailwindcss', 'vitejs/vite'];

const tabsCode = `<Tabs default-value="overview">
    <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">...</TabsContent>
</Tabs>`;

const stepperCode = `<SimpleStepper v-model="step" :steps="[
    { title: 'Account', description: 'Create your login', icon: UserIcon },
    { title: 'Workspace', description: 'Name your team' },
    { title: 'Billing' }
]" />`;

const paginationCode = `<SimplePagination v-model:page="page" :total="240" :items-per-page="20" />`;
</script>

<template>
    <div class="flex flex-col gap-12">
        <DemoPageHeader eyebrow="Components" title="Navigation" description="Indicators that glide between items, steps that fill as you progress, and disclosures that open with a spring." :icon="Navigation03Icon" />

        <!-- Tabs -->
        <DemoSection id="tabs" title="Tabs" badge="Updated" description="The active indicator slides between triggers with a spring and follows layout changes. Panels fade up on switch." :code="tabsCode">
            <div class="grid gap-8 xl:grid-cols-[1fr_auto]">
                <Tabs default-value="overview" class="min-w-0">
                    <TabsList class="max-w-full overflow-x-auto">
                        <TabsTrigger value="overview">
                            <HugeiconsIcon :icon="Home01Icon" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="analytics">
                            <HugeiconsIcon :icon="ChartLineData02Icon" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="settings">
                            <HugeiconsIcon :icon="Settings02Icon" />
                            Settings
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" class="rounded border border-border bg-surface/50 p-4 text-xs leading-6 text-muted-foreground sm:text-sm">
                        Overview panel. Switch tabs to watch the indicator glide and the panel rise in.
                    </TabsContent>
                    <TabsContent value="analytics" class="rounded border border-border bg-surface/50 p-4 text-xs leading-6 text-muted-foreground sm:text-sm">
                        Analytics panel. 12,480 visits this week, up 18% from last week.
                    </TabsContent>
                    <TabsContent value="settings" class="rounded border border-border bg-surface/50 p-4 text-xs leading-6 text-muted-foreground sm:text-sm">
                        Settings panel. Tweak notifications, members, and integrations.
                    </TabsContent>
                </Tabs>

                <!-- Vertical tabs -->
                <Tabs default-value="profile" orientation="vertical" class="flex-col gap-4 sm:flex-row">
                    <TabsList>
                        <TabsTrigger value="profile" class="justify-start">
                            <HugeiconsIcon :icon="UserIcon" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="security" class="justify-start">
                            <HugeiconsIcon :icon="ShieldUserIcon" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger value="billing" class="justify-start">
                            <HugeiconsIcon :icon="CreditCardIcon" />
                            Billing
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent v-for="tab in ['profile', 'security', 'billing']" :key="tab" :value="tab" class="text-xs sm:w-48 leading-6 text-muted-foreground">
                        Vertical orientation: the indicator slides on the Y axis. Current tab: <span class="font-semibold text-foreground capitalize">{{ tab }}</span>.
                    </TabsContent>
                </Tabs>
            </div>
        </DemoSection>

        <!-- Stepper -->
        <DemoSection id="stepper" title="Stepper" badge="New" description="Connectors fill with an expo ease as steps complete, the active step gets a glowing ring, and completed steps pop a check." :code="stepperCode">
            <div class="flex flex-col gap-10">
                <SimpleStepper v-model="step" :steps="steps" />
                <div class="flex items-center justify-between gap-3">
                    <Button variant="secondary" size="sm" :disabled="step <= 1" @click="step--">Back</Button>
                    <span class="text-xs text-muted-foreground">Step {{ step }} of {{ steps.length }}</span>
                    <Button size="sm" :disabled="step >= steps.length" @click="step++">Continue</Button>
                </div>
                <div class="grid gap-6 border-t border-border pt-8 md:grid-cols-[auto_1fr]">
                    <SimpleStepper v-model="verticalStep" :steps="steps.slice(0, 3)" orientation="vertical" :linear="false" />
                    <p class="self-center text-xs leading-6 text-muted-foreground">
                        Vertical steppers work well for onboarding checklists. With <code class="rounded-sm bg-surface px-1">linear</code> disabled, any step can be clicked.
                    </p>
                </div>
            </div>
        </DemoSection>

        <!-- Pagination -->
        <DemoSection id="pagination" title="Pagination" badge="New" description="The current page pops with a glow, and arrows nudge toward their direction on hover. Ellipses collapse long ranges." :code="paginationCode" preview-class="flex flex-col items-center gap-4">
            <SimplePagination v-model:page="page" :total="240" :items-per-page="20" />
            <span class="text-xs text-muted-foreground">Showing {{ (page - 1) * 20 + 1 }}–{{ Math.min(page * 20, 240) }} of 240 results</span>
        </DemoSection>

        <!-- Accordion and collapsible -->
        <DemoSection id="accordion" title="Accordion & collapsible" badge="Updated" description="Accordions are now real buttons with aria-expanded; content rises and un-blurs as it opens. Collapsible animates its height from reka's measured size.">
            <div class="grid gap-8 lg:grid-cols-2">
                <div class="flex flex-col gap-3">
                    <Accordion title="What is UI Vintage?" :icon="Home01Icon" initially-expanded>
                        <p class="text-xs leading-6 text-muted-foreground sm:text-sm">A source-published Nuxt component library with shared tokens, i18n, and a motion system.</p>
                    </Accordion>
                    <Accordion title="Does it respect reduced motion?" :icon="Settings02Icon">
                        <p class="text-xs leading-6 text-muted-foreground sm:text-sm">Yes. Durations collapse globally when the user prefers reduced motion, and JS-driven animations check the media query.</p>
                    </Accordion>
                    <Accordion title="Can I control it?" :icon="ShieldUserIcon">
                        <p class="text-xs leading-6 text-muted-foreground sm:text-sm">Use v-model:open for controlled usage, or initially-expanded for uncontrolled usage.</p>
                    </Accordion>
                </div>

                <!-- Collapsible -->
                <Collapsible v-model:open="reposOpen" class="flex flex-col gap-2">
                    <div class="flex items-center justify-between gap-4">
                        <span class="text-sm font-semibold">Starred repositories</span>
                        <CollapsibleTrigger as-child>
                            <Button variant="ghost" size="icon-sm" aria-label="Toggle repositories">
                                <HugeiconsIcon :icon="ArrowDown01Icon" :class="['transition-transform duration-300 ease-spring', reposOpen && 'rotate-180']" />
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <div class="rounded border border-border bg-card px-4 py-3 text-xs font-semibold">{{ repositories[0] }}</div>
                    <CollapsibleContent class="flex flex-col gap-2">
                        <div v-for="repository in repositories.slice(1)" :key="repository" class="rounded border border-border bg-card px-4 py-3 text-xs font-semibold">
                            {{ repository }}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </DemoSection>

        <!-- Breadcrumb -->
        <DemoSection id="breadcrumb" title="Breadcrumb" description="Compose trails with links, separators, and a collapsed ellipsis menu." preview-class="flex justify-center py-10!">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger class="flex items-center gap-1 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
                                <BreadcrumbEllipsis class="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Projects</DropdownMenuItem>
                                <DropdownMenuItem>Acme Inc.</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Navigation</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </DemoSection>
    </div>
</template>