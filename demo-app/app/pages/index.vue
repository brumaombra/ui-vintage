<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ArrowRight01Icon, Building03Icon, ChartLineData02Icon, Copy01Icon, Globe02Icon, MagicWand01Icon, Money03Icon, Rocket01Icon, Search01Icon, Settings02Icon, SparklesIcon, StarIcon, Tick02Icon, UserGroupIcon, ZapIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@brumaombra/ui-vintage/avatar';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Button } from '@brumaombra/ui-vintage/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
import { DataTable } from '@brumaombra/ui-vintage/data-table';
import type { DataTableColumn, DataTableSort } from '@brumaombra/ui-vintage/data-table';
import { KbdGroup } from '@brumaombra/ui-vintage/kbd';
import { showMessageToast } from '@brumaombra/ui-vintage/message-toast';
import { Progress } from '@brumaombra/ui-vintage/progress';
import { RadioGroup, RadioGroupCard } from '@brumaombra/ui-vintage/radio-group';
import { SingleValueCard } from '@brumaombra/ui-vintage/single-value-card';
import { Switch } from '@brumaombra/ui-vintage/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brumaombra/ui-vintage/tabs';
import DemoSection from '~/components/demo/DemoSection.vue';
import { demoNavigation } from '~/utils/demo-navigation';

definePageMeta({ layout: 'dashboard' });

const paletteOpen = useState('demo-palette-open', () => false);
const installCopied = ref(false);
const goalsReady = ref(false);

// Copy the install command
const handleCopyInstall = async () => {
    await navigator.clipboard?.writeText('npm install @brumaombra/ui-vintage');
    installCopied.value = true;
    window.setTimeout(() => {
        installCopied.value = false;
    }, 1600);
};

// Key metrics for the dashboard preview
const dashboardMetrics = [
    { label: 'Revenue', value: 48290, icon: Money03Icon, trend: 12.4, trendLabel: 'last 12 weeks', formatOptions: { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 } },
    { label: 'Active accounts', value: 1284, icon: UserGroupIcon, trend: 4.1, description: '312 joined this quarter' },
    { label: 'Conversion', value: 0.038, icon: ChartLineData02Icon, trend: 0.6, valueColor: 'green', formatOptions: { style: 'percent', maximumFractionDigits: 1 } },
    { label: 'Churn', value: 0.012, icon: ZapIcon, trend: -0.3, valueColor: 'red', description: 'Lowest in a year', formatOptions: { style: 'percent', maximumFractionDigits: 1 } }
];
const recentActivity = [
    { name: 'Ada Lovelace', action: 'upgraded to Enterprise', time: '2m', img: 'https://i.pravatar.cc/96?img=47' },
    { name: 'Alan Turing', action: 'invited 4 teammates', time: '18m', img: 'https://i.pravatar.cc/96?img=12' },
    { name: 'Grace Hopper', action: 'paid invoice INV-2041', time: '1h', img: 'https://i.pravatar.cc/96?img=32' }
];

// Customers table
interface Account {
    id: number;
    company: string;
    plan: string;
    mrr: number;
    health: number;
}
const accounts = ref<Account[]>([
    { id: 1, company: 'Acme Inc.', plan: 'Enterprise', mrr: 4200, health: 92 },
    { id: 2, company: 'Globex', plan: 'Pro', mrr: 980, health: 71 },
    { id: 3, company: 'Initech', plan: 'Pro', mrr: 490, health: 45 },
    { id: 4, company: 'Umbrella', plan: 'Enterprise', mrr: 3600, health: 88 },
    { id: 5, company: 'Hooli', plan: 'Starter', mrr: 120, health: 63 }
]);
const accountColumns: DataTableColumn<Account>[] = [
    { key: 'company', label: 'Company', sortable: true },
    { key: 'plan', label: 'Plan', sortable: true },
    { key: 'health', label: 'Health', sortable: true, width: '30%' },
    { key: 'mrr', label: 'MRR', sortable: true, align: 'right', format: value => `€${Number(value).toLocaleString('en-US')}` }
];
const accountSort = ref<DataTableSort | null>({ key: 'mrr', direction: 'desc' });
const selectedAccounts = ref<PropertyKey[]>([]);

// Settings form
const plan = ref('pro');
const weeklyReport = ref(true);
const anomalyAlerts = ref(true);
const saving = ref(false);

// Simulate saving the settings form
const handleSave = async () => {
    saving.value = true;
    await new Promise(resolve => setTimeout(resolve, 1200));
    saving.value = false;
    showMessageToast({ title: 'Settings saved', message: `You're on the ${plan.value} plan with ${[weeklyReport.value && 'weekly reports', anomalyAlerts.value && 'anomaly alerts'].filter(Boolean).join(' and ') || 'no notifications'}.`, type: 'success' });
};

// Pages shown in the explore grid
const explorePages = computed(() => demoNavigation.flatMap(group => group.items).filter(page => page.id !== 'overview'));

// Fill the goal bars after mount
onMounted(() => {
    window.setTimeout(() => {
        goalsReady.value = true;
    }, 250);
});
</script>

<template>
    <div class="flex flex-col gap-16">
        <!-- Hero -->
        <section class="relative isolate flex flex-col items-center gap-6 pt-6 text-center sm:pt-12">
            <!-- Announcement -->
            <button type="button" class="group/announce animate-uv-fade-up cursor-pointer rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45" @click="navigateTo('/foundations#motion')">
                <Badge text="New motion system · 20 new components" color="yellow" pulse class="px-3 py-1 transition-colors duration-150 group-hover/announce:border-yellow-300 dark:group-hover/announce:border-yellow-700/60" />
            </button>

            <!-- Title -->
            <h1 class="max-w-3xl animate-uv-fade-up text-4xl leading-[1.05] font-semibold tracking-tight [animation-delay:80ms] sm:text-6xl">
                Interfaces that feel
                <span class="relative inline-block text-primary">
                    alive
                    <svg class="absolute -bottom-2 left-0 w-full text-primary/60" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
                        <path d="M2 9C40 3 80 2 198 7" stroke="currentColor" stroke-width="4" stroke-linecap="round" pathLength="1" class="animate-uv-draw [stroke-dasharray:1] [animation-delay:0.6s]" />
                    </svg>
                </span>.
            </h1>

            <!-- Subtitle -->
            <p class="max-w-2xl animate-uv-fade-up text-sm leading-7 text-muted-foreground [animation-delay:160ms] sm:text-base">
                UI Vintage is a source-published Nuxt component library with a retro soul: monospace, bordered, warm orange, and powered by a spring-based motion system that makes every click land.
            </p>

            <!-- Actions -->
            <div class="flex animate-uv-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
                <Button size="lg" as-child>
                    <NuxtLink to="/components/actions">
                        Browse components
                        <HugeiconsIcon :icon="ArrowRight01Icon" />
                    </NuxtLink>
                </Button>
                <Button variant="secondary" size="lg" @click="paletteOpen = true">
                    <HugeiconsIcon :icon="Search01Icon" />
                    Quick search
                    <KbdGroup :keys="['mod', 'k']" class="ml-2 hidden sm:inline-flex" />
                </Button>
            </div>

            <!-- Install command -->
            <button type="button" class="group/install flex animate-uv-fade-up cursor-pointer items-center gap-3 rounded border border-border bg-card px-4 py-2.5 text-xs shadow-elevated-sm outline-none [animation-delay:320ms] [transition:border-color_150ms,translate_300ms_var(--ease-spring)] hover:-translate-y-0.5 hover:border-border-strong focus-visible:ring-[3px] focus-visible:ring-ring/45" @click="handleCopyInstall">
                <span class="text-primary">$</span>
                <span class="font-semibold">npm install @brumaombra/ui-vintage</span>
                <Transition mode="out-in" enter-active-class="transition-[opacity,scale] duration-300 ease-bounce" enter-from-class="opacity-0 scale-50" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
                    <HugeiconsIcon v-if="installCopied" :icon="Tick02Icon" class="size-4 text-success" />
                    <HugeiconsIcon v-else :icon="Copy01Icon" class="size-4 text-muted-foreground group-hover/install:text-foreground" />
                </Transition>
            </button>
        </section>

        <!-- Library stats -->
        <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SingleValueCard label="Public entry points" :value="84" :icon="Rocket01Icon" description="Explicit, tree-shakeable imports" />
            <SingleValueCard label="Bundled locales" :value="9" :icon="Globe02Icon" description="Merged into your vue-i18n" />
            <SingleValueCard label="Motion curves" :value="4" :icon="MagicWand01Icon" description="Springs as pure CSS linear()" />
            <SingleValueCard label="Build steps" :value="0" :icon="ZapIcon" description="Compiled by your Nuxt app" />
        </section>

        <!-- Live app preview -->
        <DemoSection id="live-preview" title="Live app preview" description="A tiny product built only with UI Vintage components. Everything is interactive: switch tabs, sort the table, change the plan, save.">
            <Tabs default-value="dashboard" class="gap-5">
                <TabsList>
                    <TabsTrigger value="dashboard">
                        <HugeiconsIcon :icon="ChartLineData02Icon" />
                        Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="customers">
                        <HugeiconsIcon :icon="UserGroupIcon" />
                        Customers
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                        <HugeiconsIcon :icon="Settings02Icon" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <!-- Dashboard tab -->
                <TabsContent value="dashboard" class="flex flex-col gap-4">
                    <!-- Key metrics -->
                    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SingleValueCard v-for="metric in dashboardMetrics" :key="metric.label" v-bind="metric" />
                    </div>

                    <div class="grid gap-4 lg:grid-cols-2">
                        <!-- Goals -->
                        <Card>
                            <CardHeader>
                                <CardTitle>Quarter goals</CardTitle>
                            </CardHeader>
                            <CardContent class="gap-4">
                                <div v-for="goal in [{ label: 'New customers', value: 82 }, { label: 'Expansion revenue', value: 64 }, { label: 'NPS responses', value: 37 }]" :key="goal.label" class="flex flex-col gap-2">
                                    <div class="flex justify-between text-xs font-semibold"><span>{{ goal.label }}</span><span class="text-muted-foreground tabular-nums">{{ goal.value }}%</span></div>
                                    <Progress :model-value="goalsReady ? goal.value : 0" />
                                </div>
                            </CardContent>
                        </Card>

                        <!-- Activity -->
                        <Card class="flex-1">
                            <CardHeader>
                                <div class="flex items-center justify-between">
                                    <CardTitle>Activity</CardTitle>
                                    <AvatarGroup :max="3" size="xs">
                                        <Avatar v-for="item in recentActivity" :key="item.name" size="xs">
                                            <AvatarImage :src="item.img" :alt="item.name" />
                                            <AvatarFallback :name="item.name" />
                                        </Avatar>
                                    </AvatarGroup>
                                </div>
                            </CardHeader>
                            <CardContent class="gap-3">
                                <div v-for="item in recentActivity" :key="item.name" class="flex items-center gap-3 text-xs">
                                    <Avatar size="sm" status="online">
                                        <AvatarImage :src="item.img" :alt="item.name" />
                                        <AvatarFallback :name="item.name" />
                                    </Avatar>
                                    <span class="min-w-0 flex-1 truncate"><span class="font-semibold">{{ item.name }}</span> <span class="text-muted-foreground">{{ item.action }}</span></span>
                                    <span class="text-muted-foreground">{{ item.time }}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <!-- Customers tab -->
                <TabsContent value="customers">
                    <DataTable v-model:sort="accountSort" v-model:selected="selectedAccounts" :columns="accountColumns" :rows="accounts" selectable>
                        <template #cell-company="{ row }">
                            <div class="flex items-center gap-3">
                                <Avatar size="sm" shape="square">
                                    <AvatarFallback :name="row.company" />
                                </Avatar>
                                <span class="font-semibold">{{ row.company }}</span>
                            </div>
                        </template>
                        <template #cell-plan="{ row }">
                            <Badge :text="row.plan" :color="row.plan === 'Enterprise' ? 'yellow' : row.plan === 'Pro' ? 'blue' : 'gray'" />
                        </template>
                        <template #cell-health="{ row }">
                            <div class="flex items-center gap-3">
                                <Progress :model-value="row.health" :class="row.health < 50 ? '[&>[data-slot=progress-indicator]]:bg-destructive' : ''" />
                                <span class="w-8 text-right text-xs tabular-nums text-muted-foreground">{{ row.health }}</span>
                            </div>
                        </template>
                    </DataTable>
                </TabsContent>

                <!-- Settings tab -->
                <TabsContent value="settings" class="grid gap-6 lg:grid-cols-2">
                    <div class="flex flex-col gap-3">
                        <span class="text-sm font-semibold">Plan</span>
                        <RadioGroup v-model="plan">
                            <RadioGroupCard value="starter" label="Starter" description="Up to 3 projects" :icon="StarIcon" />
                            <RadioGroupCard value="pro" label="Pro" description="Unlimited projects, priority support" :icon="Rocket01Icon" />
                            <RadioGroupCard value="enterprise" label="Enterprise" description="SSO, audit logs, SLA" :icon="Building03Icon" />
                        </RadioGroup>
                    </div>
                    <div class="flex flex-col gap-3">
                        <span class="text-sm font-semibold">Notifications</span>
                        <div class="flex items-center justify-between gap-4 rounded border border-border bg-card p-4">
                            <div>
                                <div class="text-sm font-semibold">Weekly report</div>
                                <div class="text-xs text-muted-foreground">A summary every Monday morning.</div>
                            </div>
                            <Switch v-model="weeklyReport" />
                        </div>
                        <div class="flex items-center justify-between gap-4 rounded border border-border bg-card p-4">
                            <div>
                                <div class="text-sm font-semibold">Anomaly alerts</div>
                                <div class="text-xs text-muted-foreground">Get pinged when metrics spike.</div>
                            </div>
                            <Switch v-model="anomalyAlerts" />
                        </div>
                        <Button class="mt-auto self-end" :loading="saving" @click="handleSave">
                            <HugeiconsIcon :icon="Money03Icon" />
                            Save settings
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </DemoSection>

        <!-- Explore -->
        <DemoSection id="explore" title="Explore the library" description="Every category has live, interactive examples with copyable code.">
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <NuxtLink v-for="page in explorePages" :key="page.id" :to="page.to" class="group/explore rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
                    <Card interactive class="h-full gap-3!">
                        <CardHeader>
                            <div class="mb-2 flex size-10 items-center justify-center rounded border border-primary/30 text-primary transition-colors duration-150 group-hover/explore:border-primary/60">
                                <HugeiconsIcon :icon="page.icon" class="size-5" />
                            </div>
                            <CardTitle class="flex items-center gap-2">
                                {{ page.label }}
                                <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4 text-muted-foreground transition-[translate,color] duration-300 ease-spring group-hover/explore:translate-x-1 group-hover/explore:text-primary" />
                            </CardTitle>
                            <CardDescription>{{ page.description }}</CardDescription>
                        </CardHeader>
                        <CardContent v-if="page.sections.length" class="flex-row flex-wrap gap-1.5">
                            <span v-for="section in page.sections.slice(0, 4)" :key="section.id" class="rounded-sm border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{{ section.title }}</span>
                            <span v-if="page.sections.length > 4" class="px-1 py-0.5 text-[10px] font-semibold text-muted-foreground">+{{ page.sections.length - 4 }}</span>
                        </CardContent>
                    </Card>
                </NuxtLink>
            </div>
        </DemoSection>

        <!-- Footer note -->
        <p class="flex items-center justify-center gap-2 pb-4 text-center text-xs text-muted-foreground">
            <HugeiconsIcon :icon="SparklesIcon" class="size-4 text-primary" />
            Respects prefers-reduced-motion everywhere.
        </p>
    </div>
</template>
