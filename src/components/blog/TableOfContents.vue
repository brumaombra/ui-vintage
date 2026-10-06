<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowDown01Icon, ArrowRight01Icon, Bookmark01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';

interface BlogTocLink {
    id?: string;
    text?: string;
    depth?: number;
    children?: BlogTocLink[];
}

interface TocHeading {
    id: string;
    text: string;
    level: number;
    number: string;
}

// Props
const props = defineProps<{
    content: {
        body?: {
            toc?: {
                links?: BlogTocLink[];
            };
        };
        toc?: {
            links?: BlogTocLink[];
        };
    };
}>();

const { t } = useI18n();

const DESKTOP_MEDIA_QUERY = '(min-width: 1280px)';
const HEADING_OBSERVER_RETRY_MS = 100;
const MAX_HEADING_OBSERVER_RETRIES = 20;
const MOBILE_CLOSE_SCROLL_DELAY_MS = 320;
const ACTIVE_HEADING_OFFSET_PX = 120;

const inlineListId = useId();
const inlineRef = ref<HTMLElement | null>(null);
const isInlineOpen = ref(false);
const mobileTriggerRef = ref<HTMLElement | null>(null);
const isDesktop = ref(false);
const isDocked = ref(false);
const isMobileOpen = ref(false);
const activeHeadingId = ref('');
const visibleHeadingIds = ref<Set<string>>(new Set());

let desktopMediaQuery: MediaQueryList | null = null;
let sentinelObserver: IntersectionObserver | null = null;
let headingObserver: IntersectionObserver | null = null;
let headingRetryTimeout = 0;
let mobileScrollTimeout = 0;
let restoreMobileTriggerFocus = true;

// Create the headings list
const headings = computed(() => {
    const tocLinks = props.content?.body?.toc?.links || props.content?.toc?.links || [];

    // Recursive function to flatten the nested links
    const flattenLinks = (links: BlogTocLink[]): TocHeading[] => {
        return links.flatMap(link => {
            // Extract the current heading
            const currentHeading = {
                id: link.id ?? '',
                text: link.text ?? '',
                level: link.depth ?? 0,
                number: ''
            };

            // Recursively flatten the children links
            const children = link.children?.length ? flattenLinks(link.children) : [];
            return [currentHeading, ...children];
        });
    };

    // Keep h2 and h3 headings and number the main sections
    let sectionNumber = 0;
    return flattenLinks(tocLinks)
        .filter(heading => heading.id && heading.text && heading.level >= 2 && heading.level <= 3)
        .map(heading => ({
            ...heading,
            number: heading.level === 2 ? String(++sectionNumber).padStart(2, '0') : ''
        }));
});

// Number of main sections shown in the header
const sectionCount = computed(() => headings.value.filter(heading => heading.level === 2).length);

// Title and description for the table of contents
const tocTitle = computed(() => t('uiVintage.blog.tableOfContents'));
const tocDescription = computed(() => t('uiVintage.blog.tableOfContentsDescription'));
const tocSections = computed(() => t('uiVintage.blog.tableOfContentsSections', { count: sectionCount.value }, sectionCount.value));

// Prefer reduced motion for heading scroll
const prefersReducedMotion = () => {
    return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
};

// Resolve the heading that should be marked as the current chapter
const resolveActiveHeadingId = () => {
    if (!headings.value.length) return '';

    // Filter the headings to only those currently visible in the viewport
    const visibleHeadings = headings.value.filter(heading => visibleHeadingIds.value.has(heading.id));
    if (visibleHeadings.length > 0) {
        return visibleHeadings[0].id;
    }

    // If no headings are currently visible, fall back to the first heading in the list
    let currentId = headings.value[0].id;
    for (const heading of headings.value) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= ACTIVE_HEADING_OFFSET_PX) {
            currentId = heading.id;
        }
    }

    // Return the resolved current heading ID
    return currentId;
};

// Update the active heading based on the current scroll position
const updateActiveHeading = () => {
    activeHeadingId.value = resolveActiveHeadingId();
};

// Track which headings currently intersect the reading window
const handleHeadingIntersect = (entries: IntersectionObserverEntry[]) => {
    const nextVisibleIds = new Set(visibleHeadingIds.value);

    // Update the set of visible heading IDs
    for (const entry of entries) {
        if (entry.isIntersecting) {
            nextVisibleIds.add(entry.target.id);
        } else {
            nextVisibleIds.delete(entry.target.id);
        }
    }

    // Apply the updated set
    visibleHeadingIds.value = nextVisibleIds;
    updateActiveHeading();
};

// Disconnect the heading observer and clear any pending retries
const disconnectHeadingObserver = () => {
    headingObserver?.disconnect();
    headingObserver = null;
    window.clearTimeout(headingRetryTimeout);
};

// Bind the heading observer to track which headings are visible in the viewport
const bindHeadingObserver = () => {
    disconnectHeadingObserver();

    // If there are no headings, clear the active heading and visible heading IDs
    if (!headings.value.length) {
        activeHeadingId.value = '';
        visibleHeadingIds.value = new Set();
        return true;
    }

    // Get the DOM elements corresponding to the headings
    const elements = headings.value
        .map(heading => document.getElementById(heading.id))
        .filter((element): element is HTMLElement => Boolean(element));

    // Content renderer mounts after this component, so headings may not exist yet
    if (!elements.length) return false;

    headingObserver = new IntersectionObserver(handleHeadingIntersect, {
        root: null,
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 1]
    });

    for (const element of elements) {
        headingObserver.observe(element);
    }

    if (!activeHeadingId.value) {
        activeHeadingId.value = headings.value[0].id;
    }

    updateActiveHeading();
    return true;
};

// Retry binding until the content renderer has mounted its headings
const scheduleHeadingObserver = (attempt = 0) => {
    nextTick(() => {
        if (bindHeadingObserver()) return;
        if (attempt >= MAX_HEADING_OBSERVER_RETRIES) return;

        headingRetryTimeout = window.setTimeout(() => {
            scheduleHeadingObserver(attempt + 1);
        }, HEADING_OBSERVER_RETRY_MS);
    });
};

// Disconnect the observer that controls the mobile trigger visibility
const disconnectSentinelObserver = () => {
    sentinelObserver?.disconnect();
    sentinelObserver = null;
};

// Show the mobile trigger after the in-flow accordion leaves the viewport
const bindSentinelObserver = () => {
    disconnectSentinelObserver();

    if (!inlineRef.value) {
        isDocked.value = false;
        return;
    }

    // Show the mobile control once the in-flow accordion has scrolled completely out of view
    sentinelObserver = new IntersectionObserver(([entry]) => {
        const hasScrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        isDocked.value = hasScrolledPast;
    }, {
        threshold: 0
    });

    sentinelObserver.observe(inlineRef.value);
};

// Keep the mobile trigger state in sync with the viewport breakpoint
const handleDesktopMediaChange = (event: MediaQueryList | MediaQueryListEvent) => {
    isDesktop.value = event.matches;

    if (event.matches) {
        isMobileOpen.value = false;
    }

    nextTick(() => {
        bindSentinelObserver();
    });
};

// Synchronize the mobile sheet state and restore focus after dismissal
const handleMobileOpenChange = (open: boolean) => {
    isMobileOpen.value = open;

    // Return focus to the persistent control when the overlay is dismissed
    if (!open && restoreMobileTriggerFocus) {
        mobileTriggerRef.value?.focus();
    }

    restoreMobileTriggerFocus = true;
};

// Scroll to a heading and optionally close the mobile sheet first
const scrollToHeading = (id: string, options: { closeMobile?: boolean } = {}) => {
    const runScroll = () => {
        const element = document.getElementById(id);
        if (!element) return;

        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '-1');
        }

        element.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start',
            inline: 'nearest'
        });
        element.focus({ preventScroll: true });
        activeHeadingId.value = id;

        if (window.location.hash !== `#${id}`) {
            history.replaceState(null, '', `#${id}`);
        }
    };
    restoreMobileTriggerFocus = false;

    if (options.closeMobile && isMobileOpen.value) {
        mobileTriggerRef.value?.focus();
        isMobileOpen.value = false;
        window.clearTimeout(mobileScrollTimeout);
        mobileScrollTimeout = window.setTimeout(runScroll, MOBILE_CLOSE_SCROLL_DELAY_MS);
        return;
    }

    runScroll();
};

// Open the mobile table of contents sheet
const openMobileToc = () => {
    isMobileOpen.value = true;
};

// Get classes for heading button
const getHeadingButtonClasses = (level: number, isActive: boolean) => {
    // Base classes for all titles
    const baseClasses = 'flex w-full cursor-pointer gap-3 rounded-r py-1.5 pr-2 text-left text-xs outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45 md:text-sm';

    // Main sections carry a number, subsections align with their text
    const levelClasses = level === 2 ? 'pl-4 font-medium' : 'pl-12 md:text-xs';

    // Add classes based on the active state
    let stateClasses = level === 2 ? 'text-foreground/80' : 'text-muted-foreground';
    if (isActive) {
        stateClasses = 'font-semibold text-foreground';
    }

    // Return combined classes
    return [baseClasses, levelClasses, stateClasses];
};

// Watch for changes in the headings and update the visible heading IDs and active heading ID accordingly
watch(headings, () => {
    visibleHeadingIds.value = new Set();
    activeHeadingId.value = headings.value[0]?.id ?? '';
    scheduleHeadingObserver();
});

// Watch for changes in the inline table of contents reference and bind the sentinel observer accordingly
watch(inlineRef, () => {
    bindSentinelObserver();
}, { flush: 'post' });

// On component mounted
onMounted(() => {
    desktopMediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    handleDesktopMediaChange(desktopMediaQuery);
    desktopMediaQuery.addEventListener('change', handleDesktopMediaChange);

    const hashId = window.location.hash.replace(/^#/, '');
    if (hashId && headings.value.some(heading => heading.id === hashId)) {
        activeHeadingId.value = hashId;
    }

    scheduleHeadingObserver();
});

// On component unmounted
onUnmounted(() => {
    desktopMediaQuery?.removeEventListener('change', handleDesktopMediaChange);
    disconnectSentinelObserver();
    disconnectHeadingObserver();
    window.clearTimeout(mobileScrollTimeout);
});
</script>

<template>
    <div v-if="headings.length > 0">
        <!-- In-flow collapsible card; replaced by the mobile control after it scrolls away -->
        <div ref="inlineRef" class="mb-6" :aria-hidden="isDocked" :inert="isDocked">
            <Card class="gap-0! overflow-hidden p-0! sm:gap-0!">
                <!-- Header -->
                <button type="button" :aria-expanded="isInlineOpen" :aria-controls="inlineListId" class="group/toc flex w-full cursor-pointer items-center gap-3 px-5 py-3.5 text-left outline-none focus-visible:bg-surface focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/40" @click="isInlineOpen = !isInlineOpen">
                    <span class="flex size-7 shrink-0 items-center justify-center rounded border border-primary/30 text-primary">
                        <HugeiconsIcon :icon="Bookmark01Icon" class="size-3.5" />
                    </span>
                    <span class="min-w-0 truncate text-sm font-semibold text-foreground">{{ tocTitle }}</span>
                    <span class="ml-auto shrink-0 text-xs text-muted-foreground">{{ tocSections }}</span>
                    <HugeiconsIcon :icon="ArrowDown01Icon" :class="['size-4 shrink-0 text-muted-foreground transition-[rotate,color] duration-[420ms] ease-spring group-hover/toc:text-primary', isInlineOpen && 'rotate-180 text-primary']" />
                </button>

                <!-- Collapsible list -->
                <div :id="inlineListId" role="region" :aria-hidden="!isInlineOpen" :inert="!isInlineOpen || undefined" :class="['grid transition-[grid-template-rows,opacity] duration-[380ms] ease-out-expo', isInlineOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0']">
                    <div class="overflow-hidden">
                        <nav :aria-label="tocTitle" class="border-t border-border px-5 py-4">
                            <ol>
                                <li v-for="heading in headings" :key="`inline-${heading.id}`" class="relative border-l border-border">
                                    <!-- Active marker on the track -->
                                    <span aria-hidden="true" :class="['absolute inset-y-1 -left-px w-0.5 origin-center bg-primary transition-transform duration-300 ease-spring', heading.id === activeHeadingId ? 'scale-y-100' : 'scale-y-0']" />
                                    <button type="button" :class="getHeadingButtonClasses(heading.level, heading.id === activeHeadingId)" :aria-current="heading.id === activeHeadingId ? 'location' : undefined" @click="scrollToHeading(heading.id)">
                                        <span v-if="heading.number" :class="['w-5 shrink-0 text-[11px] leading-5 tabular-nums transition-colors', heading.id === activeHeadingId ? 'text-primary' : 'text-muted-foreground']">{{ heading.number }}</span>
                                        <span>{{ heading.text }}</span>
                                    </button>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </Card>
        </div>

        <Teleport to="body">
            <!-- Mobile persistent control -->
            <Transition name="toc-tab">
                <button v-if="!isDesktop && isDocked" ref="mobileTriggerRef" type="button" class="group/toc-tab fixed top-4/5 left-0 z-20 flex h-16 w-7 -translate-y-1/2 items-center justify-center rounded-r border border-l-0 border-border bg-card text-primary shadow-elevated-sm transition-[width] duration-300 ease-out-expo hover:w-8 focus-visible:z-30 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45" :aria-label="t('uiVintage.blog.openTableOfContents')" :aria-expanded="isMobileOpen" aria-haspopup="dialog" aria-controls="toc-mobile-overlay" @click="openMobileToc">
                    <HugeiconsIcon :icon="ArrowRight01Icon" class="size-3.5 transition-[translate] duration-300 ease-spring group-hover/toc-tab:translate-x-0.5" aria-hidden="true" />
                </button>
            </Transition>

            <!-- Mobile full-screen overlay -->
            <Sheet :open="isMobileOpen" @update:open="handleMobileOpenChange">
                <SheetContent id="toc-mobile-overlay" side="left" class="flex h-full w-full max-w-none flex-col gap-0 border-0 bg-card p-0 data-[state=open]:[animation-duration:320ms] data-[state=open]:[animation-timing-function:var(--ease-out-expo)] sm:max-w-none">
                    <SheetHeader class="flex-row items-center justify-between gap-4 border-b border-border p-5">
                        <!-- Mobile table of contents header -->
                        <div class="flex min-w-0 items-center gap-3">
                            <!-- Mobile table of contents icon -->
                            <div class="flex size-7 shrink-0 items-center justify-center rounded border border-primary/30 text-primary">
                                <HugeiconsIcon :icon="Bookmark01Icon" class="size-3.5" />
                            </div>

                            <!-- Mobile table of contents title and description -->
                            <div class="min-w-0">
                                <SheetTitle class="text-sm md:text-base! font-semibold text-foreground">
                                    {{ tocTitle }}
                                </SheetTitle>
                                <SheetDescription class="sr-only">
                                    {{ tocDescription }}
                                </SheetDescription>
                                <p aria-hidden="true" class="text-xs text-muted-foreground">
                                    {{ tocSections }}
                                </p>
                            </div>
                        </div>

                        <!-- Close button for the mobile table of contents -->
                        <SheetClose as-child>
                            <Button type="button" variant="ghost" size="icon-sm" :aria-label="t('uiVintage.blog.closeTableOfContents')">
                                <HugeiconsIcon :icon="Cancel01Icon" class="size-4" />
                            </Button>
                        </SheetClose>
                    </SheetHeader>

                    <!-- Mobile table of contents navigation -->
                    <nav :aria-label="tocTitle" class="flex-1 overflow-y-auto p-5">
                        <ol>
                            <li v-for="heading in headings" :key="`mobile-${heading.id}`" class="relative border-l border-border">
                                <!-- Active marker on the track -->
                                <span aria-hidden="true" :class="['absolute inset-y-1 -left-px w-0.5 bg-primary', heading.id === activeHeadingId ? 'opacity-100' : 'opacity-0']" />
                                <button type="button" :class="getHeadingButtonClasses(heading.level, heading.id === activeHeadingId)" :aria-current="heading.id === activeHeadingId ? 'location' : undefined" @click="scrollToHeading(heading.id, { closeMobile: true })">
                                    <span v-if="heading.number" :class="['w-5 shrink-0 text-[11px] leading-5 tabular-nums', heading.id === activeHeadingId ? 'text-primary' : 'text-muted-foreground']">{{ heading.number }}</span>
                                    <span>{{ heading.text }}</span>
                                </button>
                            </li>
                        </ol>
                    </nav>
                </SheetContent>
            </Sheet>
        </Teleport>
    </div>
</template>

<style scoped>
.toc-tab-enter-active {
    transition: opacity 0.3s var(--ease-out-expo), transform 0.32s var(--ease-out-expo);
}

.toc-tab-leave-active {
    transition: opacity 0.15s var(--ease-snappy), transform 0.15s var(--ease-snappy);
}

.toc-tab-enter-from,
.toc-tab-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}

@media (prefers-reduced-motion: reduce) {

    .toc-tab-enter-active,
    .toc-tab-leave-active {
        transition: none;
    }
}
</style>