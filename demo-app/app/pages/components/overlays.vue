<script setup lang="ts">
import { ref } from 'vue';
import { Calendar03Icon, CommandIcon, Delete02Icon, Layers01Icon, Link01Icon, Search01Icon, Settings02Icon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@brumaombra/ui-vintage/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@brumaombra/ui-vintage/avatar';
import { Badge } from '@brumaombra/ui-vintage/badge';
import { Button } from '@brumaombra/ui-vintage/button';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from '@brumaombra/ui-vintage/command';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@brumaombra/ui-vintage/dialog';
import { Field, FieldGroup, FieldLabel } from '@brumaombra/ui-vintage/field';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@brumaombra/ui-vintage/hover-card';
import { Input } from '@brumaombra/ui-vintage/input';
import { KbdGroup } from '@brumaombra/ui-vintage/kbd';
import { showMessageToast } from '@brumaombra/ui-vintage/message-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@brumaombra/ui-vintage/popover';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@brumaombra/ui-vintage/sheet';
import { Switch } from '@brumaombra/ui-vintage/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@brumaombra/ui-vintage/tooltip';
import DemoPageHeader from '~/components/demo/DemoPageHeader.vue';
import DemoSection from '~/components/demo/DemoSection.vue';

definePageMeta({ layout: 'dashboard' });

const paletteOpen = useState('demo-palette-open', () => false);
const profileName = ref('Satoshi Nakamoto');
const profileHandle = ref('@satoshi');
const emailNotifications = ref(true);
const sheetSides = ['top', 'right', 'bottom', 'left'] as const;

// Save the profile form and close the dialog
const handleSaveProfile = () => {
    showMessageToast({ title: 'Profile updated', message: `Saved changes for ${profileName.value}.`, type: 'success' });
};

const dialogCode = `<Dialog>
    <DialogTrigger as-child><Button>Edit profile</Button></DialogTrigger>
    <DialogContent show-close-button>
        <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile.</DialogDescription>
        </DialogHeader>
        ...
    </DialogContent>
</Dialog>`;

const sheetCode = `<Sheet>
    <SheetTrigger as-child><Button>Open</Button></SheetTrigger>
    <SheetContent side="right">...</SheetContent>
</Sheet>`;
</script>

<template>
    <div class="flex flex-col gap-12">
        <DemoPageHeader eyebrow="Components" title="Overlays" description="Modals spring in with a blur, sheets glide from any edge, and floating surfaces grow out of their trigger." :icon="Layers01Icon" />

        <!-- Dialog -->
        <DemoSection id="dialog" title="Dialog" badge="Updated" description="Dialogs rise and un-blur with a spring over a frosted backdrop. The close button spins on hover." :code="dialogCode" preview-class="flex flex-wrap items-center justify-center gap-4 py-12!">
            <!-- Edit profile -->
            <Dialog>
                <DialogTrigger as-child>
                    <Button>
                        <HugeiconsIcon :icon="UserIcon" />
                        Edit profile
                    </Button>
                </DialogTrigger>
                <DialogContent show-close-button class="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>Make changes to your public profile. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <FieldLabel for="dialog-name">Name</FieldLabel>
                            <Input id="dialog-name" v-model="profileName" />
                        </Field>
                        <Field>
                            <FieldLabel for="dialog-handle">Username</FieldLabel>
                            <Input id="dialog-handle" v-model="profileHandle" />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose as-child>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <DialogClose as-child>
                            <Button @click="handleSaveProfile">Save changes</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <!-- Destructive alert dialog -->
            <AlertDialog>
                <AlertDialogTrigger as-child>
                    <Button variant="red">
                        <HugeiconsIcon :icon="Delete02Icon" />
                        Delete project
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <div class="px-5 pt-5 pb-5 sm:px-6 sm:pt-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete "acme-dashboard"?</AlertDialogTitle>
                            <AlertDialogDescription>This permanently deletes the project, its deployments, and 14 environment variables. This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction class="bg-destructive text-white hover:bg-destructive/90" @click="showMessageToast({ message: 'Project deleted.', type: 'error' })">Delete project</AlertDialogAction>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DemoSection>

        <!-- Sheet -->
        <DemoSection id="sheet" title="Sheet" badge="Updated" description="Side panels glide in from any edge with a spring and leave quickly." :code="sheetCode" preview-class="flex flex-wrap items-center justify-center gap-3 py-12!">
            <Sheet v-for="side in sheetSides" :key="side">
                <SheetTrigger as-child>
                    <Button variant="secondary" class="capitalize">{{ side }}</Button>
                </SheetTrigger>
                <SheetContent :side="side">
                    <SheetHeader>
                        <SheetTitle>Workspace settings</SheetTitle>
                        <SheetDescription>This sheet slid in from the {{ side }} edge.</SheetDescription>
                    </SheetHeader>
                    <div class="flex flex-col gap-4 px-4">
                        <div class="flex items-center justify-between gap-4 rounded border border-border p-4">
                            <div>
                                <div class="text-sm font-semibold">Email notifications</div>
                                <div class="text-xs text-muted-foreground">Receive a daily summary.</div>
                            </div>
                            <Switch v-model="emailNotifications" />
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose as-child>
                            <Button>Done</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </DemoSection>

        <!-- Popover and tooltip -->
        <DemoSection id="popover-tooltip" title="Popover & tooltip" badge="Updated" description="Floating surfaces scale and un-blur from their trigger's transform origin, on every side." preview-class="flex flex-wrap items-center justify-center gap-4 py-12!">
            <!-- Popover -->
            <Popover>
                <PopoverTrigger as-child>
                    <Button variant="secondary">
                        <HugeiconsIcon :icon="Settings02Icon" />
                        Dimensions
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="w-80">
                    <div class="flex flex-col gap-4">
                        <div>
                            <div class="text-sm font-semibold">Dimensions</div>
                            <p class="mt-1 text-xs text-muted-foreground">Set the dimensions for the layer.</p>
                        </div>
                        <div class="grid grid-cols-[80px_1fr] items-center gap-3">
                            <label class="text-xs font-semibold" for="pop-width">Width</label>
                            <Input id="pop-width" model-value="100%" class="h-10" />
                            <label class="text-xs font-semibold" for="pop-height">Height</label>
                            <Input id="pop-height" model-value="auto" class="h-10" />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <!-- Tooltips on every side -->
            <Tooltip v-for="side in ['top', 'right', 'bottom', 'left'] as const" :key="side">
                <TooltipTrigger as-child>
                    <Button variant="ghost" class="capitalize">{{ side }}</Button>
                </TooltipTrigger>
                <TooltipContent :side="side">Tooltip on the {{ side }}</TooltipContent>
            </Tooltip>
        </DemoSection>

        <!-- Hover card -->
        <DemoSection id="hover-card" title="Hover card" badge="New" description="Rich previews on hover with open and close delays that feel intentional." preview-class="flex justify-center py-12!">
            <p class="text-sm text-muted-foreground">
                Built with love by
                <HoverCard>
                    <HoverCardTrigger as-child>
                        <a href="https://github.com/brumaombra" target="_blank" rel="noopener" class="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4">@brumaombra</a>
                    </HoverCardTrigger>
                    <HoverCardContent class="w-80">
                        <div class="flex gap-4">
                            <Avatar size="lg">
                                <AvatarImage src="https://github.com/brumaombra.png" alt="brumaombra" />
                                <AvatarFallback name="Mauro Brambilla" />
                            </Avatar>
                            <div class="flex flex-col gap-1.5">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold">Mauro Brambilla</span>
                                    <Badge text="Author" color="yellow" />
                                </div>
                                <p class="text-xs leading-5 text-muted-foreground">Creator of UI Vintage, a Nuxt component library with a vintage soul.</p>
                                <div class="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                    <HugeiconsIcon :icon="Calendar03Icon" class="size-3.5" />
                                    Joined March 2019
                                </div>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </p>
        </DemoSection>

        <!-- Command -->
        <DemoSection id="command" title="Command palette" badge="Updated" description="Inline or in a dialog. Filtering matches text and keywords, and a primary bar springs onto the highlighted row." preview-class="flex flex-col items-center gap-6">
            <Command class="max-w-md rounded border border-border shadow-elevated-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandGroup heading="Suggestions">
                        <CommandItem value="calendar schedule">
                            <HugeiconsIcon :icon="Calendar03Icon" />
                            Calendar
                        </CommandItem>
                        <CommandItem value="search find">
                            <HugeiconsIcon :icon="Search01Icon" />
                            Search emoji
                        </CommandItem>
                        <CommandItem value="link copy url">
                            <HugeiconsIcon :icon="Link01Icon" />
                            Copy link
                            <CommandShortcut>⌘L</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Settings">
                        <CommandItem value="profile account">
                            <HugeiconsIcon :icon="UserIcon" />
                            Profile
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem value="settings preferences">
                            <HugeiconsIcon :icon="Settings02Icon" />
                            Settings
                            <CommandShortcut>⌘,</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
            <Button variant="secondary" @click="paletteOpen = true">
                <HugeiconsIcon :icon="CommandIcon" />
                Open the global palette
                <KbdGroup :keys="['mod', 'k']" class="ml-1" />
            </Button>
        </DemoSection>
    </div>
</template>