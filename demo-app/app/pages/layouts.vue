<script setup lang="ts">
import { ref } from 'vue';
import { Alert02Icon, ArrowRight01Icon, DashboardSquare01Icon, Folder01Icon, LayoutTwoColumnIcon, News01Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Button } from '@brumaombra/ui-vintage/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
import { CardGrid } from '@brumaombra/ui-vintage/card-grid';
import { PageHeader } from '@brumaombra/ui-vintage/page-header';
import DemoPageHeader from '~/components/demo/DemoPageHeader.vue';
import DemoSection from '~/components/demo/DemoSection.vue';

definePageMeta({ layout: 'dashboard' });

// Card grid with simulated pagination
const projectNames = ['Aurora', 'Basalt', 'Cinder', 'Delta', 'Ember', 'Fjord', 'Granite', 'Harbor', 'Indigo', 'Juniper', 'Kestrel', 'Lumen'];
const projects = ref(projectNames.slice(0, 4).map((name, index) => ({ id: index + 1, name })));
const loadingMore = ref(false);

// Append the next page of projects
const handleLoadMore = async () => {
    loadingMore.value = true;
    await new Promise(resolve => setTimeout(resolve, 900));
    const next = projectNames.slice(projects.value.length, projects.value.length + 4).map((name, index) => ({ id: projects.value.length + index + 1, name }));
    projects.value = [...projects.value, ...next];
    loadingMore.value = false;
};

// Application shells available in the library
const shells = [
    { title: 'Dashboard shell', description: 'Collapsible sidebar, sticky blurred topbar, and grid background. You are looking at it right now.', icon: DashboardSquare01Icon, to: '/', badge: 'You are here', external: false },
    { title: 'Landing & blog', description: 'Navbar with reading progress, content layout, footer, and a full Nuxt Content blog.', icon: News01Icon, to: '/blog', badge: '', external: false },
    { title: 'Error page', description: 'Branded 404 and 500 pages with a recovery action and toolbar slots.', icon: Alert02Icon, to: '/this-page-does-not-exist', badge: '', external: true }
];
</script>

<template>
    <div class="flex flex-col gap-12">
        <DemoPageHeader eyebrow="Patterns" title="Layouts" description="Higher-level building blocks for pages: headers, paginated grids, and complete application shells." :icon="LayoutTwoColumnIcon" />

        <!-- Page header -->
        <DemoSection id="page-header" title="Page header" description="A responsive title row with an optional actions slot, in three sizes.">
            <div class="flex flex-col gap-2">
                <PageHeader title="Projects" size="large">
                    <Button>
                        <HugeiconsIcon :icon="PlusSignIcon" />
                        New project
                    </Button>
                </PageHeader>
                <PageHeader title="Recent activity" size="medium" :heading-level="2" />
                <PageHeader title="Members" size="small" :heading-level="3">
                    <Button variant="secondary" size="sm">Invite</Button>
                </PageHeader>
            </div>
        </DemoSection>

        <!-- Card grid -->
        <DemoSection id="card-grid" title="Card grid" description="Responsive grid with built-in empty, loading, and load-more states.">
            <CardGrid :items="projects" :has-more="projects.length < projectNames.length" :load-more-busy="loadingMore" empty-message="No projects yet." @load-more="handleLoadMore">
                <template #card="{ item }">
                    <Card interactive class="animate-uv-fade-up">
                        <CardHeader>
                            <div class="mb-2 flex size-9 items-center justify-center rounded border border-primary/30 text-primary">
                                <HugeiconsIcon :icon="Folder01Icon" class="size-4" />
                            </div>
                            <CardTitle>{{ item.name }}</CardTitle>
                            <CardDescription>Project #{{ item.id }}</CardDescription>
                        </CardHeader>
                    </Card>
                </template>
            </CardGrid>
        </DemoSection>

        <!-- Shells -->
        <DemoSection id="shells" title="Application shells" description="Complete layouts that own navigation, theming, and responsive behavior.">
            <div class="grid gap-4 md:grid-cols-3">
                <NuxtLink v-for="shell in shells" :key="shell.title" :to="shell.to" :external="shell.external" class="group/shell rounded outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45">
                    <Card interactive class="h-full">
                        <CardHeader>
                            <div class="mb-2 flex items-center justify-between">
                                <div class="flex size-10 items-center justify-center rounded border border-primary/30 text-primary">
                                    <HugeiconsIcon :icon="shell.icon" class="size-5" />
                                </div>
                                <Badge v-if="shell.badge" :text="shell.badge" color="yellow" pulse />
                            </div>
                            <CardTitle class="flex items-center gap-2">
                                {{ shell.title }}
                                <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4 text-muted-foreground transition-[translate,color] duration-300 ease-spring group-hover/shell:translate-x-1 group-hover/shell:text-primary" />
                            </CardTitle>
                            <CardDescription>{{ shell.description }}</CardDescription>
                        </CardHeader>
                    </Card>
                </NuxtLink>
            </div>
        </DemoSection>
    </div>
</template>