<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
import { Skeleton } from '@brumaombra/ui-vintage/skeleton';
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Loading Preview</CardTitle>
            <CardDescription>
                Skeletons and compact placeholders for asynchronous states.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent class="space-y-3">
            <Skeleton class="h-5 w-32" />
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-5/6" />
            <Skeleton class="h-28 w-full" />
        </CardContent>
    </Card>
</template>