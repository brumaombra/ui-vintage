<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowRight01Icon, Bookmark01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Accordion } from '../ui/accordion';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
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

const inlineRef = ref<HTMLElement | null>(null);
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
                level: link.depth ?? 0
            };

            // Recursively flatten the children links
            const children = link.children?.length ? flattenLinks(link.children) : [];
            return [currentHeading, ...children];
        });
    };

    // Return the flattened list of headings
    return flattenLinks(tocLinks).filter(heading => heading.id && heading.text && heading.level >= 2 && heading.level <= 3);
});

const tocTitle = computed(() => t('uiVintage.blog.tableOfContents'));
const tocDescription = computed(() => t('uiVintage.blog.tableOfContentsDescription'));

// Prefer reduced motion for scroll and docking animation
const prefersReducedMotion = () => {
    return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
};

// Resolve the heading that should be marked as the current chapter
const resolveActiveHeadingId = () => {
    if (!headings.value.length) return '';

    const visibleHeadings = headings.value.filter(heading => visibleHeadingIds.value.has(heading.id));
    if (visibleHeadings.length > 0) {
        return visibleHeadings[0].id;
    }

    let currentId = headings.value[0].id;
    for (const heading of headings.value) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= ACTIVE_HEADING_OFFSET_PX) {
            currentId = heading.id;
        }
    }

    return currentId;
};

const updateActiveHeading = () => {
    activeHeadingId.value = resolveActiveHeadingId();
};

// Track which headings currently intersect the reading window
const handleHeadingIntersect = (entries: IntersectionObserverEntry[]) => {
    const nextVisibleIds = new Set(visibleHeadingIds.value);

    for (const entry of entries) {
        if (entry.isIntersecting) {
            nextVisibleIds.add(entry.target.id);
        } else {
            nextVisibleIds.delete(entry.target.id);
        }
    }

    visibleHeadingIds.value = nextVisibleIds;
    updateActiveHeading();
};

const disconnectHeadingObserver = () => {
    headingObserver?.disconnect();
    headingObserver = null;
    window.clearTimeout(headingRetryTimeout);
};

const bindHeadingObserver = () => {
    disconnectHeadingObserver();

    if (!headings.value.length) {
        activeHeadingId.value = '';
        visibleHeadingIds.value = new Set();
        return true;
    }

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

const scheduleHeadingObserver = (attempt = 0) => {
    nextTick(() => {
        if (bindHeadingObserver()) return;
        if (attempt >= MAX_HEADING_OBSERVER_RETRIES) return;

        headingRetryTimeout = window.setTimeout(() => {
            scheduleHeadingObserver(attempt + 1);
        }, HEADING_OBSERVER_RETRY_MS);
    });
};

const disconnectSentinelObserver = () => {
    sentinelObserver?.disconnect();
    sentinelObserver = null;
};

const bindSentinelObserver = () => {
    disconnectSentinelObserver();

    if (!inlineRef.value) {
        isDocked.value = false;
        return;
    }

    // Dock the sidebar once the in-flow accordion has scrolled completely out of view
    sentinelObserver = new IntersectionObserver(([entry]) => {
        const hasScrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        isDocked.value = hasScrolledPast;
    }, {
        threshold: 0
    });

    sentinelObserver.observe(inlineRef.value);
};

const handleDesktopMediaChange = (event: MediaQueryList | MediaQueryListEvent) => {
    isDesktop.value = event.matches;

    if (!event.matches) {
        nextTick(() => {
            bindSentinelObserver();
        });
        return;
    }

    isMobileOpen.value = false;
    nextTick(() => {
        bindSentinelObserver();
    });
};

const handleMobileOpenChange = (open: boolean) => {
    isMobileOpen.value = open;

    // Return focus to the persistent control when the overlay is dismissed
    if (!open && restoreMobileTriggerFocus) {
        mobileTriggerRef.value?.focus();
    }

    restoreMobileTriggerFocus = true;
};

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

const openMobileToc = () => {
    isMobileOpen.value = true;
};

// Get classes for heading button
const getHeadingButtonClasses = (level: number, isActive: boolean) => {
    // Base classes for all titles
    const baseClasses = 'block w-full text-left px-2.5 py-2 md:px-3 md:py-2 rounded border-l-2 border-transparent transition-all duration-200 hover:bg-(--bg-selected-light) dark:hover:bg-(--bg-selected-dark) cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none';

    // Add classes based on heading level
    let levelClasses = '';
    if (level === 2) {
        levelClasses = 'text-(--text-primary-light) dark:text-(--text-primary-dark) font-semibold text-xs md:text-sm';
    } else {
        levelClasses = 'text-(--text-secondary-light) dark:text-(--text-secondary-dark) pl-6! text-xs md:text-sm';
    }

    const activeClasses = isActive
        ? 'bg-(--bg-selected-light) dark:bg-(--bg-selected-dark) border-l-primary text-(--text-primary-light) dark:text-(--text-primary-dark)'
        : '';

    // Return combined classes
    return [baseClasses, levelClasses, activeClasses];
};

watch(headings, () => {
    visibleHeadingIds.value = new Set();
    activeHeadingId.value = headings.value[0]?.id ?? '';
    scheduleHeadingObserver();
});

watch(inlineRef, () => {
    bindSentinelObserver();
}, { flush: 'post' });

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

onUnmounted(() => {
    desktopMediaQuery?.removeEventListener('change', handleDesktopMediaChange);
    disconnectSentinelObserver();
    disconnectHeadingObserver();
    window.clearTimeout(mobileScrollTimeout);
});
</script>

<template>
    <div v-if="headings.length > 0">
        <!-- Desktop in-flow accordion; docks to a left sidebar after it scrolls away -->
        <div ref="inlineRef" class="mb-6" :aria-hidden="isDocked" :inert="isDocked">
            <Accordion :title="tocTitle" :icon="Bookmark01Icon">
                <nav :aria-label="tocTitle" class="space-y-1">
                    <button v-for="heading in headings" :key="`inline-${heading.id}`" type="button" :class="getHeadingButtonClasses(heading.level, heading.id === activeHeadingId)" :aria-current="heading.id === activeHeadingId ? 'location' : undefined" @click="scrollToHeading(heading.id)">
                        {{ heading.text }}
                    </button>
                </nav>
            </Accordion>
        </div>

        <Teleport to="body">
            <!-- Desktop sticky sidebar -->
            <Transition name="toc-dock">
                <aside v-if="isDesktop && isDocked" class="fixed top-35 left-[max(0rem,calc(50%-45rem))] z-20 hidden w-48 xl:block 2xl:w-60" :aria-label="tocTitle">
                    <Card class="p-5!">
                        <CardContent class="p-0! gap-3">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-(--border-light) bg-(--bg-card-light) dark:border-(--border-dark) dark:bg-(--bg-card-dark)">
                                    <HugeiconsIcon :icon="Bookmark01Icon" class="size-4 text-(--text-secondary-light) dark:text-(--text-secondary-dark)" />
                                </div>
                                <div class="text-sm font-semibold text-(--text-primary-light) dark:text-(--text-primary-dark)">
                                    {{ tocTitle }}
                                </div>
                            </div>

                            <nav :aria-label="tocTitle" class="max-h-[calc(100vh-12rem)] space-y-1 overflow-y-auto">
                                <button v-for="heading in headings" :key="`docked-${heading.id}`" type="button" :class="getHeadingButtonClasses(heading.level, heading.id === activeHeadingId)" :aria-current="heading.id === activeHeadingId ? 'location' : undefined" @click="scrollToHeading(heading.id)">
                                    {{ heading.text }}
                                </button>
                            </nav>
                        </CardContent>
                    </Card>
                </aside>
            </Transition>

            <!-- Mobile persistent control -->
            <Transition name="toc-tab">
                <button v-if="!isDesktop && isDocked" ref="mobileTriggerRef" type="button" class="fixed top-1/2 left-0 z-20 flex h-16 w-8 -translate-y-1/2 items-center justify-center rounded-r border border-l-0 border-(--border-light) bg-(--bg-card-light) text-(--text-secondary-light) shadow-lg transition-[background-color,color,transform] duration-200 hover:bg-(--bg-selected-light) hover:text-(--text-primary-light) focus-visible:z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:border-(--border-dark) dark:bg-(--bg-card-dark) dark:text-(--text-secondary-dark) dark:hover:bg-(--bg-selected-dark) dark:hover:text-(--text-primary-dark) motion-reduce:transition-none xl:hidden" :aria-label="t('uiVintage.blog.openTableOfContents')" :aria-expanded="isMobileOpen" aria-haspopup="dialog" aria-controls="toc-mobile-overlay" @click="openMobileToc">
                    <HugeiconsIcon :icon="ArrowRight01Icon" class="size-4" aria-hidden="true" />
                </button>
            </Transition>

            <!-- Mobile full-screen overlay -->
            <Sheet :open="isMobileOpen" @update:open="handleMobileOpenChange">
                <SheetContent id="toc-mobile-overlay" side="left" class="flex h-full w-full max-w-none flex-col gap-0 border-0 bg-(--bg-card-light) p-0 dark:bg-(--bg-card-dark) sm:max-w-none">
                    <SheetHeader class="flex-row items-center justify-between gap-4 border-b border-(--border-light) p-5 dark:border-(--border-dark)">
                        <div class="flex min-w-0 items-center gap-3">
                            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-(--border-light) bg-(--bg-card-light) dark:border-(--border-dark) dark:bg-(--bg-card-dark)">
                                <HugeiconsIcon :icon="Bookmark01Icon" class="size-4 text-(--text-secondary-light) dark:text-(--text-secondary-dark)" />
                            </div>
                            <div class="min-w-0">
                                <SheetTitle class="text-sm md:text-base! font-semibold text-(--text-primary-light) dark:text-(--text-primary-dark)">
                                    {{ tocTitle }}
                                </SheetTitle>
                                <SheetDescription class="sr-only">
                                    {{ tocDescription }}
                                </SheetDescription>
                            </div>
                        </div>

                        <SheetClose as-child>
                            <Button type="button" variant="ghost" size="icon-sm" :aria-label="t('uiVintage.blog.closeTableOfContents')">
                                <HugeiconsIcon :icon="Cancel01Icon" class="size-4" />
                            </Button>
                        </SheetClose>
                    </SheetHeader>

                    <nav :aria-label="tocTitle" class="flex-1 overflow-y-auto p-5">
                        <div class="space-y-1">
                            <button v-for="heading in headings" :key="`mobile-${heading.id}`" type="button" :class="getHeadingButtonClasses(heading.level, heading.id === activeHeadingId)" :aria-current="heading.id === activeHeadingId ? 'location' : undefined" @click="scrollToHeading(heading.id, { closeMobile: true })">
                                {{ heading.text }}
                            </button>
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
        </Teleport>
    </div>
</template>

<style scoped>
.toc-dock-enter-active,
.toc-dock-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.toc-dock-enter-from,
.toc-dock-leave-to {
    opacity: 0;
    transform: translateX(-1rem);
}

.toc-tab-enter-active,
.toc-tab-leave-active {
    transition: opacity 0.25s ease;
}

.toc-tab-enter-from,
.toc-tab-leave-to {
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {

    .toc-dock-enter-active,
    .toc-dock-leave-active,
    .toc-tab-enter-active,
    .toc-tab-leave-active {
        transition: none;
    }
}
</style>