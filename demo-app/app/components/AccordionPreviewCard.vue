<script setup lang="ts">
import { Accordion } from '@brumaombra/ui-vintage/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Accordion</CardTitle>
            <CardDescription>
                Expandable sections for grouped content and longer explanations.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent class="space-y-4">
            <!-- Accordion -->
            <Accordion title="What is this component for?" :initially-expanded="true">
                <p class="text-xs md:text-sm text-(--text-secondary-light) dark:text-(--text-secondary-dark) leading-relaxed">
                    Use it when you want to keep supporting content compact while still making the full details easy to reach.
                </p>
            </Accordion>

            <!-- Accordion -->
            <Accordion title="Does it support multiple items?">
                <p class="text-xs md:text-sm text-(--text-secondary-light) dark:text-(--text-secondary-dark) leading-relaxed">
                    This version is a single self-contained panel. Click the card header to expand or collapse the content.
                </p>
            </Accordion>

            <!-- Accordion -->
            <Accordion title="Can I style it further?">
                <p class="text-xs md:text-sm text-(--text-secondary-light) dark:text-(--text-secondary-dark) leading-relaxed">
                    The card, header, icon, and content spacing all use Tailwind classes, so you can tune the appearance with the usual utility overrides.
                </p>
            </Accordion>
        </CardContent>
    </Card>
</template>