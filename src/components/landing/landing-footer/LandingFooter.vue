<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue";
import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { cn } from "@/lib/utils";

export interface LandingFooterLink {
    id: string;
    label: string;
    href?: string;
    to?: unknown;
    newTab?: boolean;
}

export interface LandingFooterSection {
    id: string;
    title: string;
    links: LandingFooterLink[];
}

interface LandingFooterProps {
    appName: string;
    appLogo?: string;
    appDescription?: string;
    sections?: LandingFooterSection[];
    linkComponent?: Component | string;
    authorName?: string;
    authorLink?: string;
    year?: number;
    showBottomBar?: boolean;
    class?: HTMLAttributes["class"];
    containerClass?: HTMLAttributes["class"];
    brandClass?: HTMLAttributes["class"];
    sectionsClass?: HTMLAttributes["class"];
    bottomBarClass?: HTMLAttributes["class"];
}

// Props
const props = withDefaults(defineProps<LandingFooterProps>(), {
    appDescription: "",
    sections: () => [],
    linkComponent: "a",
    authorName: "",
    authorLink: "",
    year: () => new Date().getFullYear(),
    showBottomBar: true
});

const { t } = useI18n();
const hasSingleSection = computed(() => props.sections.length === 1);

// Get link props based on the type of link component and whether the link should open in a new tab
const getLinkProps = (link: LandingFooterLink) => {
    const sharedProps = link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

    // If the link component is an anchor, use href. Otherwise, use to for router links.
    if (props.linkComponent === "a") {
        return {
            href: link.href ?? "#",
            ...sharedProps
        };
    }

    // For non-anchor link components, assume they use a "to" prop (like Vue Router's <RouterLink>).
    return {
        to: link.to ?? link.href ?? "/",
        ...sharedProps
    };
};
</script>

<template>
    <footer :class="cn('relative z-10 border-t border-border bg-card', props.class)">
        <div :class="cn('mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8', props.containerClass)">
            <div :class="cn('flex flex-col gap-8 md:flex-row md:items-start md:justify-between')">
                <!-- Brand section -->
                <div :class="cn('max-w-md flex-1', props.brandClass)">
                    <!-- App logo and name -->
                    <div class="mb-4 inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
                        <img v-if="props.appLogo" :src="props.appLogo" :alt="`${props.appName} logo`" class="size-8 shrink-0 object-contain">
                        <span>{{ props.appName }}</span>
                    </div>

                    <!-- App description -->
                    <p v-if="props.appDescription" class="max-w-sm text-xs md:text-sm leading-relaxed text-muted-foreground">
                        {{ props.appDescription }}
                    </p>
                </div>

                <!-- Single link section -->
                <div v-if="hasSingleSection" :class="cn('min-w-0 md:flex md:justify-end', props.sectionsClass)">
                    <div class="md:text-right">
                        <!-- Section title -->
                        <h3 class="mb-4 font-semibold text-foreground">
                            {{ props.sections[0]?.title }}
                        </h3>

                        <!-- Section links -->
                        <ul class="space-y-3 text-xs sm:text-sm">
                            <li v-for="link in props.sections[0]?.links" :key="link.id">
                                <component :is="props.linkComponent" v-bind="getLinkProps(link)" class="text-muted-foreground transition-colors duration-200 hover:text-foreground">
                                    {{ link.label }}
                                </component>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Link sections -->
                <div v-else class="flex flex-col gap-8 md:max-w-[60%] md:flex-row md:flex-wrap md:justify-end md:gap-16">
                    <div v-for="section in props.sections" :key="section.id" :class="cn('min-w-28', props.sectionsClass)">
                        <!-- Section title -->
                        <h3 class="mb-4 font-semibold text-foreground">
                            {{ section.title }}
                        </h3>

                        <!-- Section links -->
                        <ul class="space-y-3 text-xs sm:text-sm">
                            <li v-for="link in section.links" :key="link.id">
                                <component :is="props.linkComponent" v-bind="getLinkProps(link)" class="text-muted-foreground transition-colors duration-200 hover:text-foreground">
                                    {{ link.label }}
                                </component>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Bottom bar -->
            <div v-if="props.showBottomBar" :class="cn('mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs md:text-sm text-muted-foreground md:flex-row', props.bottomBarClass)">
                <!-- Copyright -->
                <div>
                    &copy; {{ props.year }} {{ props.appName }}. {{ t("ui-vintage.footer.allRightsReserved") }}
                </div>

                <!-- Author -->
                <div v-if="props.authorName && props.authorLink" class="flex flex-wrap items-center justify-center gap-1.5 md:justify-end">
                    <span>{{ t("ui-vintage.footer.madeWith") }}</span>
                    <HugeiconsIcon :icon="FavouriteIcon" class="size-4 shrink-0 text-red-700 dark:text-red-400" />
                    <span>{{ t("ui-vintage.footer.by") }}</span>
                    <a :href="props.authorLink" target="_blank" rel="noopener noreferrer" class="font-medium text-foreground hover:underline">
                        {{ props.authorName }}
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>