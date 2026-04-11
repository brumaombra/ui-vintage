<script setup lang="ts">
import { ArrowRight01Icon, CheckmarkCircle02Icon, InformationCircleIcon, SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>
                Variant, icon spacing, and inline usage checks for compact status labels.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent class="space-y-6">
            <!-- Variant previews -->
            <div class="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
            </div>

            <!-- Badge content with icons -->
            <div class="flex flex-wrap gap-3">
                <Badge>
                    <HugeiconsIcon :icon="SparklesIcon" />
                    Featured
                </Badge>

                <Badge variant="secondary">
                    <HugeiconsIcon :icon="CheckmarkCircle02Icon" />
                    Stable
                </Badge>

                <Badge variant="outline">
                    <HugeiconsIcon :icon="InformationCircleIcon" />
                    Beta
                </Badge>
            </div>

            <!-- Inline usage preview -->
            <div class="rounded border border-border bg-card px-4 py-4 text-sm leading-6 text-foreground">
                New dashboard shell updates are available
                <Badge variant="outline" class="mx-2 align-middle">v0.2.2</Badge>
                and ready for review.
                <Badge class="ml-2 align-middle">
                    <HugeiconsIcon :icon="ArrowRight01Icon" />
                    Continue
                </Badge>
            </div>
        </CardContent>
    </Card>
</template>