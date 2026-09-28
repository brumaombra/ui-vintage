<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChartLineData02Icon, Delete02Icon, Invoice01Icon, Money03Icon, PackageIcon, RefreshIcon, Rocket01Icon, Search01Icon, ShieldUserIcon, Table01Icon, UserGroupIcon, ZapIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { AnimatedNumber } from '@brumaombra/ui-vintage/animated-number';
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@brumaombra/ui-vintage/avatar';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Button } from '@brumaombra/ui-vintage/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
import { Chip } from '@brumaombra/ui-vintage/chip';
import { DataList, DataListItem, DataListLabel, DataListValue } from '@brumaombra/ui-vintage/data-list';
import { DataTable } from '@brumaombra/ui-vintage/data-table';
import type { DataTableColumn, DataTableSort } from '@brumaombra/ui-vintage/data-table';
import { InfoCard } from '@brumaombra/ui-vintage/info-card';
import { Input } from '@brumaombra/ui-vintage/input';
import { showMessageToast } from '@brumaombra/ui-vintage/message-toast';
import { SimplePagination } from '@brumaombra/ui-vintage/pagination';
import { Progress } from '@brumaombra/ui-vintage/progress';
import { ProgressComponent } from '@brumaombra/ui-vintage/progress-component';
import { SingleValueCard } from '@brumaombra/ui-vintage/single-value-card';
import { Skeleton } from '@brumaombra/ui-vintage/skeleton';
import { Switch } from '@brumaombra/ui-vintage/switch';
import DemoPageHeader from '~/components/demo/DemoPageHeader.vue';
import DemoSection from '~/components/demo/DemoSection.vue';

definePageMeta({ layout: 'dashboard' });

type ToneColor = 'gray' | 'green' | 'red' | 'blue' | 'yellow';

// Data table
interface Customer {
    id: number;
    name: string;
    email: string;
    status: 'Active' | 'Trial' | 'Churned' | 'Past due';
    plan: string;
    mrr: number;
    seats: number;
}

const customers = ref<Customer[]>([
    { id: 1, name: 'Ada Lovelace', email: 'ada@analytical.io', status: 'Active', plan: 'Enterprise', mrr: 4200, seats: 48 },
    { id: 2, name: 'Alan Turing', email: 'alan@bletchley.dev', status: 'Active', plan: 'Pro', mrr: 490, seats: 10 },
    { id: 3, name: 'Grace Hopper', email: 'grace@cobol.org', status: 'Past due', plan: 'Pro', mrr: 245, seats: 5 },
    { id: 4, name: 'Linus Torvalds', email: 'linus@kernel.org', status: 'Trial', plan: 'Starter', mrr: 0, seats: 2 },
    { id: 5, name: 'Margaret Hamilton', email: 'margaret@apollo.space', status: 'Active', plan: 'Enterprise', mrr: 3100, seats: 36 },
    { id: 6, name: 'Dennis Ritchie', email: 'dmr@bell-labs.com', status: 'Churned', plan: 'Pro', mrr: 0, seats: 0 },
    { id: 7, name: 'Barbara Liskov', email: 'barbara@mit.edu', status: 'Active', plan: 'Pro', mrr: 735, seats: 15 },
    { id: 8, name: 'Ken Thompson', email: 'ken@plan9.dev', status: 'Trial', plan: 'Starter', mrr: 0, seats: 3 }
]);
const columns: DataTableColumn<Customer>[] = [
    { key: 'name', label: 'Customer', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'plan', label: 'Plan', sortable: true },
    { key: 'seats', label: 'Seats', sortable: true, align: 'right' },
    { key: 'mrr', label: 'MRR', sortable: true, align: 'right', format: value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(value)) }
];
const statusColors: Record<Customer['status'], ToneColor> = { 'Active': 'green', 'Trial': 'blue', 'Churned': 'gray', 'Past due': 'red' };
const selected = ref<PropertyKey[]>([2, 5]);
const sort = ref<DataTableSort | null>({ key: 'mrr', direction: 'desc' });
const query = ref('');
const tableLoading = ref(false);
const page = ref(1);
const filteredCustomers = computed(() => customers.value.filter(customer => `${customer.name} ${customer.email} ${customer.plan}`.toLowerCase().includes(query.value.toLowerCase())));

// Remove the selected rows (they animate out)
const handleDeleteSelected = () => {
    const count = selected.value.length;
    customers.value = customers.value.filter(customer => !selected.value.includes(customer.id));
    selected.value = [];
    showMessageToast({ message: `${count} customer(s) removed.`, type: 'success', action: { label: 'Undo', onClick: handleReset } });
};

// Restore demo data with a short loading state
const handleReset = async () => {
    tableLoading.value = true;
    await new Promise(resolve => setTimeout(resolve, 900));
    customers.value = [
        { id: 1, name: 'Ada Lovelace', email: 'ada@analytical.io', status: 'Active', plan: 'Enterprise', mrr: 4200, seats: 48 },
        { id: 2, name: 'Alan Turing', email: 'alan@bletchley.dev', status: 'Active', plan: 'Pro', mrr: 490, seats: 10 },
        { id: 3, name: 'Grace Hopper', email: 'grace@cobol.org', status: 'Past due', plan: 'Pro', mrr: 245, seats: 5 },
        { id: 4, name: 'Linus Torvalds', email: 'linus@kernel.org', status: 'Trial', plan: 'Starter', mrr: 0, seats: 2 },
        { id: 5, name: 'Margaret Hamilton', email: 'margaret@apollo.space', status: 'Active', plan: 'Enterprise', mrr: 3100, seats: 36 },
        { id: 6, name: 'Dennis Ritchie', email: 'dmr@bell-labs.com', status: 'Churned', plan: 'Pro', mrr: 0, seats: 0 },
        { id: 7, name: 'Barbara Liskov', email: 'barbara@mit.edu', status: 'Active', plan: 'Pro', mrr: 735, seats: 15 },
        { id: 8, name: 'Ken Thompson', email: 'ken@plan9.dev', status: 'Trial', plan: 'Starter', mrr: 0, seats: 3 }
    ];
    tableLoading.value = false;
};

// Stats
const stats = ref({ revenue: 48290, customers: 1284, conversion: 3.8, churn: 1.2 });
const randomizeStats = () => {
    stats.value = {
        revenue: Math.round(30000 + Math.random() * 40000),
        customers: Math.round(900 + Math.random() * 800),
        conversion: Math.round((2 + Math.random() * 4) * 10) / 10,
        churn: Math.round((0.5 + Math.random() * 2) * 10) / 10
    };
};

// Chips
const chips = ref([
    { id: 1, text: 'design-system', color: 'gray' as ToneColor },
    { id: 2, text: 'motion', color: 'yellow' as ToneColor },
    { id: 3, text: 'accessibility', color: 'green' as ToneColor },
    { id: 4, text: 'nuxt', color: 'blue' as ToneColor },
    { id: 5, text: 'breaking', color: 'red' as ToneColor }
]);

// Progress and skeleton
const uploadProgress = ref(35);
const contentLoaded = ref(false);
const advanceProgress = () => {
    uploadProgress.value = uploadProgress.value >= 100 ? 0 : Math.min(100, uploadProgress.value + 20 + Math.round(Math.random() * 15));
};

const team = [
    { name: 'Ada Lovelace', img: 'https://i.pravatar.cc/96?img=47', status: 'online' as const },
    { name: 'Alan Turing', img: 'https://i.pravatar.cc/96?img=12', status: 'busy' as const },
    { name: 'Grace Hopper', img: 'https://i.pravatar.cc/96?img=32', status: 'away' as const },
    { name: 'Linus Torvalds', img: '', status: 'offline' as const },
    { name: 'Margaret Hamilton', img: 'https://i.pravatar.cc/96?img=45', status: 'online' as const },
    { name: 'Dennis Ritchie', img: '', status: 'online' as const },
    { name: 'Barbara Liskov', img: 'https://i.pravatar.cc/96?img=44', status: 'online' as const }
];

const tableCode = `<DataTable v-model:selected="selected" v-model:sort="sort" :columns="columns" :rows="rows" selectable :loading="loading">
    <template #cell-status="{ value }">
        <Badge :text="value" :color="statusColors[value]" dot />
    </template>
</DataTable>`;

const statsCode = `<SingleValueCard label="Revenue" :value="48290" :icon="Money03Icon" :trend="12.4" trend-label="vs last month"
    :format-options="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" />

<AnimatedNumber :value="total" :duration="900" />`;

const avatarCode = `<Avatar size="lg" status="online">
    <AvatarImage src="/ada.jpg" />
    <AvatarFallback name="Ada Lovelace" />
</Avatar>

<AvatarGroup :max="4">...</AvatarGroup>`;
</script>

<template>
    <div class="flex flex-col gap-12">
        <DemoPageHeader eyebrow="Components" title="Data display" description="Tables that animate their rows on sort, numbers that count, and surfaces that respond to the pointer." :icon="Table01Icon" />

        <!-- Data table -->
        <DemoSection id="data-table" title="Data table" badge="New" description="Typed columns, natural sorting with FLIP-animated rows, selection with an indeterminate header, cell slots, and a skeleton loading state." :code="tableCode">
            <div class="flex flex-col gap-4">
                <!-- Toolbar -->
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div class="relative w-full sm:max-w-xs">
                        <HugeiconsIcon :icon="Search01Icon" class="pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input v-model="query" placeholder="Filter customers..." class="h-10 pl-10" />
                    </div>
                    <div class="flex items-center gap-2">
                        <Transition enter-active-class="transition-[opacity,scale] duration-300 ease-bounce" enter-from-class="opacity-0 scale-75" leave-active-class="transition-[opacity,scale] duration-150" leave-to-class="opacity-0 scale-90">
                            <Button v-if="selected.length" variant="red" size="sm" @click="handleDeleteSelected">
                                <HugeiconsIcon :icon="Delete02Icon" />
                                Delete {{ selected.length }}
                            </Button>
                        </Transition>
                        <Button variant="secondary" size="sm" @click="handleReset">
                            <HugeiconsIcon :icon="RefreshIcon" />
                            Reload
                        </Button>
                    </div>
                </div>

                <DataTable v-model:selected="selected" v-model:sort="sort" :columns="columns" :rows="filteredCustomers" selectable :loading="tableLoading" empty-text="No customers match your filter.">
                    <!-- Customer cell -->
                    <template #cell-name="{ row }">
                        <div class="flex items-center gap-3">
                            <Avatar size="sm">
                                <AvatarFallback :name="row.name" />
                            </Avatar>
                            <div class="flex flex-col">
                                <span class="font-semibold">{{ row.name }}</span>
                                <span class="text-[11px] text-muted-foreground">{{ row.email }}</span>
                            </div>
                        </div>
                    </template>

                    <!-- Status cell -->
                    <template #cell-status="{ row }">
                        <Badge :text="row.status" :color="statusColors[row.status as Customer['status']]" dot :pulse="row.status === 'Past due'" />
                    </template>
                </DataTable>

                <!-- Footer -->
                <div class="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
                    <span>{{ selected.length }} of {{ filteredCustomers.length }} row(s) selected</span>
                    <SimplePagination v-model:page="page" :total="filteredCustomers.length * 6" :items-per-page="8" />
                </div>
            </div>
        </DemoSection>

        <!-- Stats -->
        <DemoSection id="stats" title="Stats & numbers" badge="Updated" description="Numeric values count up on mount and tween to new values. Trend badges and descriptions are optional." :code="statsCode">
            <div class="flex flex-col gap-6">
                <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SingleValueCard label="Revenue" :value="stats.revenue" :icon="Money03Icon" :trend="12.4" trend-label="vs last month" :format-options="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" />
                    <SingleValueCard label="Customers" :value="stats.customers" :icon="UserGroupIcon" :trend="4.1" />
                    <SingleValueCard label="Conversion" :value="stats.conversion / 100" :icon="ChartLineData02Icon" :trend="-0.6" :format-options="{ style: 'percent', maximumFractionDigits: 1 }" value-color="green" />
                    <SingleValueCard label="Churn" :value="`${stats.churn}%`" :icon="ZapIcon" value-color="red" description="Static string values render as-is." />
                </div>
                <div class="flex flex-col items-center gap-3 rounded border border-dashed border-border py-6">
                    <span class="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Total processed</span>
                    <AnimatedNumber :value="stats.revenue * 24" :format-options="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" class="text-4xl font-bold tracking-tight sm:text-5xl" />
                    <Button variant="secondary" size="sm" @click="randomizeStats">
                        <HugeiconsIcon :icon="RefreshIcon" />
                        Randomize values
                    </Button>
                </div>
            </div>
        </DemoSection>

        <!-- Cards -->
        <DemoSection id="cards" title="Cards" badge="Updated" description="Interactive cards lift and follow the pointer with a soft spotlight. Tone variants and InfoCard are available for status surfaces.">
            <div class="flex flex-col gap-4">
                <div class="grid gap-4 md:grid-cols-3">
                    <Card v-for="card in [{ icon: Rocket01Icon, title: 'Deployments', text: 'Ship previews for every branch.' }, { icon: ShieldUserIcon, title: 'Access control', text: 'Roles, SSO and audit logs.' }, { icon: Invoice01Icon, title: 'Billing', text: 'Usage-based invoices in any currency.' }]" :key="card.title" interactive>
                        <CardHeader>
                            <div class="mb-2 flex size-10 items-center justify-center rounded border border-border bg-surface text-primary">
                                <HugeiconsIcon :icon="card.icon" class="size-5" />
                            </div>
                            <CardTitle>{{ card.title }}</CardTitle>
                            <CardDescription>{{ card.text }}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                    <Card color="green" class="py-4"><CardContent class="text-xs sm:text-sm">All systems operational · 99.99% uptime</CardContent></Card>
                    <Card color="yellow" class="py-4"><CardContent class="text-xs sm:text-sm">Scheduled maintenance on Sunday at 02:00 UTC</CardContent></Card>
                </div>
                <InfoCard :icon="PackageIcon" title="What's new" description="A motion system, 20 new components, and a brand-new demo.">
                    <template #right>
                        <Badge text="Latest" color="green" pulse />
                    </template>
                </InfoCard>
            </div>
        </DemoSection>

        <!-- Avatar -->
        <DemoSection id="avatar" title="Avatar" badge="New" description="Images fade in when loaded, initials are generated from names, and status dots pulse. Hover the group to spread it." :code="avatarCode">
            <div class="flex flex-col gap-8">
                <div class="flex flex-wrap items-end gap-4">
                    <Avatar v-for="(size, index) in ['xs', 'sm', 'md', 'lg', 'xl'] as const" :key="size" :size="size" :status="team[index]!.status">
                        <AvatarImage v-if="team[index]!.img" :src="team[index]!.img" :alt="team[index]!.name" />
                        <AvatarFallback :name="team[index]!.name" />
                    </Avatar>
                    <Avatar size="xl" shape="square">
                        <AvatarFallback name="Vintage UI" />
                    </Avatar>
                </div>
                <div class="flex flex-wrap items-center gap-8">
                    <AvatarGroup :max="4">
                        <Avatar v-for="member in team" :key="member.name">
                            <AvatarImage v-if="member.img" :src="member.img" :alt="member.name" />
                            <AvatarFallback :name="member.name" />
                        </Avatar>
                    </AvatarGroup>
                    <span class="text-xs text-muted-foreground">{{ team.length }} teammates are working on this project</span>
                </div>
            </div>
        </DemoSection>

        <!-- Badges and chips -->
        <DemoSection id="badges-chips" title="Badges & chips" badge="Updated" description="Badges gain status dots and a live pulse. Removable chips animate out.">
            <div class="flex flex-col gap-6">
                <div class="flex flex-wrap items-center gap-3">
                    <Badge text="Neutral" />
                    <Badge text="Operational" color="green" dot />
                    <Badge text="Degraded" color="yellow" pulse />
                    <Badge text="Outage" color="red" pulse />
                    <Badge text="Beta" color="blue" :icon="ZapIcon" />
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <TransitionGroup move-class="transition-transform duration-300 ease-spring" enter-active-class="transition-[opacity,scale] duration-300 ease-bounce" enter-from-class="opacity-0 scale-75" leave-active-class="absolute transition-[opacity,scale] duration-200" leave-to-class="opacity-0 scale-75">
                        <Chip v-for="chip in chips" :key="chip.id" :text="chip.text" :color="chip.color" @remove="chips = chips.filter(item => item.id !== chip.id)" />
                    </TransitionGroup>
                    <Button v-if="chips.length < 5" variant="ghost" size="sm" @click="chips = [{ id: 1, text: 'design-system', color: 'gray' }, { id: 2, text: 'motion', color: 'yellow' }, { id: 3, text: 'accessibility', color: 'green' }, { id: 4, text: 'nuxt', color: 'blue' }, { id: 5, text: 'breaking', color: 'red' }]">Reset</Button>
                </div>
            </div>
        </DemoSection>

        <!-- Progress and skeleton -->
        <DemoSection id="progress-skeleton" title="Progress & skeleton" badge="Updated" description="Progress fills with an expo ease and a moving sheen; an indeterminate mode is built in. Skeletons shimmer instead of blinking.">
            <div class="grid gap-8 lg:grid-cols-2">
                <div class="flex flex-col gap-6">
                    <ProgressComponent title="Uploading assets" :value="uploadProgress" :max="100" bottom-left-label="design-tokens.zip" :bottom-right-label="uploadProgress >= 100 ? 'Done' : `${uploadProgress}%`" />
                    <div class="flex flex-col gap-2">
                        <span class="text-xs font-semibold">Indeterminate</span>
                        <Progress indeterminate />
                    </div>
                    <Button variant="secondary" size="sm" class="self-start" @click="advanceProgress">
                        {{ uploadProgress >= 100 ? 'Restart' : 'Advance' }}
                    </Button>
                </div>

                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <Switch id="demo-loaded" v-model="contentLoaded" />
                        <label for="demo-loaded" class="text-xs font-semibold">Content loaded</label>
                    </div>
                    <Transition mode="out-in" enter-active-class="transition-[opacity,filter] duration-300" enter-from-class="opacity-0 blur-sm" leave-active-class="transition-opacity duration-150" leave-to-class="opacity-0">
                        <div v-if="!contentLoaded" key="skeleton" class="flex items-center gap-4 rounded border border-border p-4">
                            <Skeleton class="size-12 rounded-full" />
                            <div class="flex flex-1 flex-col gap-2">
                                <Skeleton class="h-4 w-2/3" />
                                <Skeleton class="h-3 w-full" />
                                <Skeleton class="h-3 w-4/5" />
                            </div>
                        </div>
                        <div v-else key="content" class="flex items-center gap-4 rounded border border-border p-4">
                            <Avatar size="lg"><AvatarImage :src="team[0]!.img" /><AvatarFallback name="Ada Lovelace" /></Avatar>
                            <div class="flex flex-col gap-1">
                                <span class="text-sm font-semibold">Ada Lovelace</span>
                                <span class="text-xs text-muted-foreground">Wrote the first algorithm intended to be carried out by a machine.</span>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </DemoSection>

        <!-- Data list -->
        <DemoSection id="data-list" title="Data list" description="Compact key-value rows for detail panels.">
            <DataList class="max-w-lg">
                <DataListItem>
                    <DataListLabel>Customer</DataListLabel>
                    <DataListValue>Ada Lovelace</DataListValue>
                </DataListItem>
                <DataListItem>
                    <DataListLabel>Plan</DataListLabel>
                    <DataListValue><Badge text="Enterprise" color="yellow" /></DataListValue>
                </DataListItem>
                <DataListItem>
                    <DataListLabel>Monthly revenue</DataListLabel>
                    <DataListValue><AnimatedNumber :value="4200" :format-options="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" /></DataListValue>
                </DataListItem>
                <DataListItem>
                    <DataListLabel>Renewal</DataListLabel>
                    <DataListValue>March 14, 2027</DataListValue>
                </DataListItem>
            </DataList>
        </DemoSection>
    </div>
</template>