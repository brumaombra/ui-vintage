<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Surface Variants</CardTitle>
            <CardDescription>
                Useful for checking border rendering and nested spacing.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent class="grid gap-3 sm:grid-cols-2">
            <!-- Nested card-like surface -->
            <div class="rounded border border-border bg-card px-4 py-4">
                <div class="text-sm font-semibold">Nested Card</div>
                <p class="mt-1 text-xs leading-5 text-muted-foreground">The semantic border color should remain stable inside another card.</p>
            </div>

            <!-- Popover-like floating surface -->
            <div class="rounded border border-border bg-popover px-4 py-4 text-popover-foreground">
                <div class="text-sm font-semibold">Floating Surface</div>
                <p class="mt-1 text-xs leading-5 text-muted-foreground">This mirrors popover/select background tokens without opening an overlay.</p>
            </div>
        </CardContent>
    </Card>
</template>