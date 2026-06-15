<script setup lang="ts">
import { ArrowRight01Icon, CheckmarkCircle02Icon, InformationCircleIcon, SparklesIcon } from '@hugeicons/core-free-icons';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>
                Tone variants, icon support, and inline usage checks for compact status labels.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent>
            <!-- Variant previews -->
            <div class="flex flex-wrap gap-3">
                <Badge text="Default" />
                <Badge text="Secondary" color="gray" />
                <Badge text="Outline" color="blue" />
                <Badge text="Destructive" color="red" />
            </div>

            <!-- Badge content with icons -->
            <div class="flex flex-wrap gap-3">
                <Badge :icon="SparklesIcon" text="Featured" color="yellow" />
                <Badge :icon="CheckmarkCircle02Icon" text="Stable" color="green" />
                <Badge :icon="InformationCircleIcon" text="Beta" color="blue" />
            </div>

            <!-- Inline usage preview -->
            <div class="rounded border border-border bg-card px-4 py-4 text-sm leading-6 text-foreground">
                New dashboard shell updates are available
                <Badge text="v0.2.2" color="blue" class="mx-2 align-middle" />
                and ready for review.
                <Badge :icon="ArrowRight01Icon" text="Continue" class="ml-2 align-middle" />
            </div>
        </CardContent>
    </Card>
</template>