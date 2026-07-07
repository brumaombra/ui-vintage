<script setup lang="ts">
import { ref } from 'vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brumaombra/ui-vintage/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';

const activeTab = ref('overview');
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>
                Compact tab navigation for switching between related views.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent>
            <Tabs v-model="activeTab" class="w-full">
                <TabsList class="w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" class="mt-4 text-sm leading-relaxed text-(--text-secondary-light) dark:text-(--text-secondary-dark)">
                    Use tabs when the content is related but you want to keep the layout compact and easy to scan.
                </TabsContent>

                <TabsContent value="details" class="mt-4 text-sm leading-relaxed text-(--text-secondary-light) dark:text-(--text-secondary-dark)">
                    This example keeps the tab trigger row full width so the selection state reads clearly in the demo grid.
                </TabsContent>

                <TabsContent value="notes" class="mt-4 text-sm leading-relaxed text-(--text-secondary-light) dark:text-(--text-secondary-dark)">
                    The shared Tabs primitives can be reused anywhere you need a lightweight section switcher.
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
</template>