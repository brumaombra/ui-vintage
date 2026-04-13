<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue";
import { computed } from "vue";
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
    appDescription?: string;
    sections?: LandingFooterSection[];
    linkComponent?: Component | string;
    copyrightName?: string;
    allRightsReservedText?: string;
    madeByText?: string;
    madeByName?: string;
    madeByLink?: string;
    year?: number;
    showBottomBar?: boolean;
    class?: HTMLAttributes["class"];
    containerClass?: HTMLAttributes["class"];
    brandClass?: HTMLAttributes["class"];
    sectionsClass?: HTMLAttributes["class"];
    bottomBarClass?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<LandingFooterProps>(), {
    appDescription: "",
    sections: () => [],
    linkComponent: "a",
    copyrightName: "",
    allRightsReservedText: "All rights reserved.",
    madeByText: "",
    madeByName: "",
    madeByLink: "",
    year: () => new Date().getFullYear(),
    showBottomBar: true
});

const resolvedCopyrightName = computed(() => props.copyrightName || props.appName);

const getLinkProps = (link: LandingFooterLink) => {
    const sharedProps = link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

    if (props.linkComponent === "a") {
        return {
            href: link.href ?? "#",
            ...sharedProps
        };
    }

    return {
        to: link.to ?? link.href ?? "/",
        ...sharedProps
    };
};
</script>

<template>
    <footer :class="cn('border-t border-border bg-card', props.class)">
        <div :class="cn('mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8', props.containerClass)">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
                <div :class="cn('col-span-1 md:col-span-2', props.brandClass)">
                    <div class="mb-4 text-lg font-semibold tracking-tight text-foreground">
                        {{ props.appName }}
                    </div>

                    <p v-if="props.appDescription" class="max-w-sm text-sm leading-relaxed text-muted-foreground">
                        {{ props.appDescription }}
                    </p>
                </div>

                <div v-for="section in props.sections" :key="section.id" :class="cn('min-w-0', props.sectionsClass)">
                    <h3 class="mb-4 font-semibold text-foreground">
                        {{ section.title }}
                    </h3>

                    <ul class="space-y-3 text-sm">
                        <li v-for="link in section.links" :key="link.id">
                            <component
                                :is="props.linkComponent"
                                v-bind="getLinkProps(link)"
                                class="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                            >
                                {{ link.label }}
                            </component>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                v-if="props.showBottomBar"
                :class="cn('mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row', props.bottomBarClass)"
            >
                <div>
                    &copy; {{ props.year }} {{ resolvedCopyrightName }}. {{ props.allRightsReservedText }}
                </div>

                <div v-if="props.madeByText && props.madeByName && props.madeByLink">
                    {{ props.madeByText }}
                    <a :href="props.madeByLink" target="_blank" rel="noopener noreferrer" class="font-medium text-foreground hover:underline">
                        {{ props.madeByName }}
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>