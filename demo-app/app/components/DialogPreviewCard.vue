<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { Cancel01Icon, InformationCircleIcon, SaveIcon } from '@hugeicons/core-free-icons';
import { Button } from '@brumaombra/ui-vintage/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@brumaombra/ui-vintage/dialog';
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Dialog</CardTitle>
            <CardDescription>
                Standard dialog content, spacing, and footer actions without the corner close button.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent>
            <Dialog>
                <!-- Dialog trigger button -->
                <DialogTrigger as-child>
                    <Button variant="outline">
                        <HugeiconsIcon :icon="InformationCircleIcon" class="size-4" />
                        Open Dialog
                    </Button>
                </DialogTrigger>

                <!-- Dialog content -->
                <DialogContent>
                    <!-- Dialog header -->
                    <DialogHeader>
                        <DialogTitle>Project summary</DialogTitle>
                        <DialogDescription>
                            This dialog preview helps verify layout rhythm, overlay styling, focus handling, and footer actions using the shared primitives.
                        </DialogDescription>
                    </DialogHeader>

                    <!-- Dialog body content -->
                    <div class="space-y-3">
                        <div class="rounded-[var(--radius)] border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                            Dialog content stays compact, centered, and action-driven.
                        </div>
                    </div>

                    <!-- Dialog footer with actions -->
                    <DialogFooter>
                        <!-- Close dialog action -->
                        <DialogClose as-child>
                            <Button variant="outline">
                                <HugeiconsIcon :icon="Cancel01Icon" class="size-4" />
                                Close
                            </Button>
                        </DialogClose>

                        <!-- Save action -->
                        <Button>
                            <HugeiconsIcon :icon="SaveIcon" class="size-4" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardContent>
    </Card>
</template>