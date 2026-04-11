<script setup lang="ts">
import { CheckmarkCircle02Icon, MouseLeftClick01Icon, SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Alert, AlertDescription, AlertTitle } from '@brumaombra/ui-vintage/alert';
import { Button } from '@brumaombra/ui-vintage/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
import { Popover, PopoverContent, PopoverTrigger } from '@brumaombra/ui-vintage/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@brumaombra/ui-vintage/tooltip';

// Emit events back to the page-level handlers
const emit = defineEmits<{
    confirmDemo: [];
    busyDemo: [];
    infoDemo: [];
}>();
</script>

<template>
    <Card class="lg:col-span-2 xl:col-span-2">
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Primary Actions</CardTitle>
            <CardDescription>
                Buttons, tooltips, popovers, and dialog flows in one place.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent class="space-y-6">
            <!-- Action buttons and overlay triggers -->
            <div class="flex flex-wrap gap-3">
                <!-- Primary action button -->
                <Button @click="emit('confirmDemo')">
                    <HugeiconsIcon :icon="SparklesIcon" class="size-4" />
                    Confirm Flow
                </Button>

                <!-- Secondary action button -->
                <Button variant="outline" @click="emit('busyDemo')">
                    <HugeiconsIcon :icon="MouseLeftClick01Icon" class="size-4" />
                    Busy Overlay
                </Button>

                <!-- Tooltip trigger -->
                <Tooltip>
                    <TooltipTrigger as-child>
                        <Button variant="ghost">Tooltip</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Hover states, focus handling, and spacing can be checked here.
                    </TooltipContent>
                </Tooltip>

                <!-- Popover trigger -->
                <Popover>
                    <PopoverTrigger as-child>
                        <Button variant="outline">Open Popover</Button>
                    </PopoverTrigger>
                    <PopoverContent class="space-y-3">
                        <div>
                            <div class="text-sm font-semibold">Popover Surface</div>
                            <p class="mt-1 text-xs leading-5 text-muted-foreground">
                                Useful for checking border, background, and motion on floating surfaces.
                            </p>
                        </div>
                        <Button size="sm" class="w-full">Take Action</Button>
                    </PopoverContent>
                </Popover>
            </div>

            <!-- Status alert -->
            <Alert>
                <HugeiconsIcon :icon="CheckmarkCircle02Icon" class="size-4" />
                <AlertTitle>Theme tokens are active</AlertTitle>
                <AlertDescription>
                    Cards, overlays, and controls in this screen intentionally mix semantic tokens and custom component states.
                </AlertDescription>
            </Alert>
        </CardContent>

        <!-- Card footer -->
        <CardFooter class="justify-between border-t border-border">
            <span class="text-xs text-muted-foreground">Use this panel for interaction checks.</span>
            <Button variant="link" size="sm" @click="emit('infoDemo')">Open message dialog</Button>
        </CardFooter>
    </Card>
</template>