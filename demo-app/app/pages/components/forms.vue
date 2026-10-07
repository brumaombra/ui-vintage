<script setup lang="ts">
import { computed, ref } from 'vue';
import { Building03Icon, CodeIcon, CreditCardIcon, Globe02Icon, InputTextIcon, Mail01Icon, Rocket01Icon, ShieldUserIcon, StarIcon, ZapIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Button } from '@brumaombra/ui-vintage/button';
import { Checkbox } from '@brumaombra/ui-vintage/checkbox';
import { ComboboxSelect } from '@brumaombra/ui-vintage/combobox';
import { DatePicker } from '@brumaombra/ui-vintage/date-picker';
import { DateTimePicker } from '@brumaombra/ui-vintage/date-time-picker';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@brumaombra/ui-vintage/field';
import { FileDropzone } from '@brumaombra/ui-vintage/file-dropzone';
import type { FileRejection } from '@brumaombra/ui-vintage/file-dropzone';
import { Input } from '@brumaombra/ui-vintage/input';
import { Label } from '@brumaombra/ui-vintage/label';
import { showMessageToast } from '@brumaombra/ui-vintage/message-toast';
import { NumberField } from '@brumaombra/ui-vintage/number-field';
import { PinInput } from '@brumaombra/ui-vintage/pin-input';
import { RadioGroup, RadioGroupCard, RadioGroupItem } from '@brumaombra/ui-vintage/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectItemContent, SelectLabel, SelectTrigger, SelectValueContent } from '@brumaombra/ui-vintage/select';
import { Slider } from '@brumaombra/ui-vintage/slider';
import { SliderFormComponent } from '@brumaombra/ui-vintage/slider-form-component';
import { Switch } from '@brumaombra/ui-vintage/switch';
import { SwitchFormComponent } from '@brumaombra/ui-vintage/switch-form-component';
import { TagsInput } from '@brumaombra/ui-vintage/tags-input';
import { Textarea } from '@brumaombra/ui-vintage/textarea';
import { TimePicker } from '@brumaombra/ui-vintage/time-picker';
import DemoPageHeader from '~/components/demo/DemoPageHeader.vue';
import DemoSection from '~/components/demo/DemoSection.vue';

definePageMeta({ layout: 'dashboard' });

// Text fields
const email = ref('satoshi@');
const emailTouched = ref(true);
const bio = ref('Building calm, fast interfaces.');
const emailError = computed(() => emailTouched.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? 'Enter a valid email address, like name@company.com.' : '');

// Select
const region = ref('eu-west');
const regionOptions = [
    { value: 'eu-west', label: 'Europe (Milan)', description: 'eu-west-1 · 12ms', icon: Globe02Icon },
    { value: 'us-east', label: 'US East (Virginia)', description: 'us-east-1 · 94ms', icon: Globe02Icon },
    { value: 'ap-south', label: 'Asia Pacific (Mumbai)', description: 'ap-south-1 · 148ms', icon: Globe02Icon }
];
const selectedRegion = computed(() => regionOptions.find(option => option.value === region.value));

// Combobox
const framework = ref<string | null>('nuxt');
const stack = ref<string[]>(['vue', 'tailwind']);
const frameworkOptions = [
    { value: 'nuxt', label: 'Nuxt', description: 'The intuitive Vue framework', icon: Rocket01Icon },
    { value: 'vue', label: 'Vue', description: 'Progressive JavaScript framework', icon: CodeIcon },
    { value: 'tailwind', label: 'Tailwind CSS', description: 'Utility-first styling', icon: ZapIcon },
    { value: 'reka', label: 'Reka UI', description: 'Accessible primitives', icon: ShieldUserIcon },
    { value: 'vite', label: 'Vite', description: 'Next generation tooling', icon: StarIcon },
    { value: 'pinia', label: 'Pinia', description: 'Intuitive state management', icon: Building03Icon }
];

// Checkbox and radio
const acceptTerms = ref(true);
const notifications = ref({ mentions: true, digest: false, product: true });
const allNotifications = computed(() => {
    const values = Object.values(notifications.value);
    return values.every(Boolean) ? true : values.some(Boolean) ? 'indeterminate' : false;
});
const plan = ref('pro');
const shipping = ref('standard');

// Toggle all notification checkboxes at once
const toggleAllNotifications = () => {
    const nextValue = allNotifications.value !== true;
    notifications.value = { mentions: nextValue, digest: nextValue, product: nextValue };
};

// Switch and slider
const autoDeploy = ref(true);
const previewBranches = ref(false);
const volume = ref([64]);
const budget = ref(1200);
const range = ref([20, 80]);

// Number, pin, and tags
const seats = ref(5);
const price = ref(49.9);
const code = ref<number[]>([]);
const codeInvalid = ref(false);
const skills = ref(['Vue', 'Nuxt', 'Motion design']);

// Verify the PIN when all cells are filled
const handleCodeComplete = (value: number[]) => {
    codeInvalid.value = value.join('') !== '424242';
    showMessageToast(codeInvalid.value
        ? { message: 'That code is not valid. Hint: 424242', type: 'error' }
        : { title: 'Verified', message: 'Two-factor authentication is enabled.', type: 'success' });
};

// Dates
const meeting = ref<Date | null>(new Date());
const reminder = ref('09:30');

// Files
const files = ref<File[]>([]);

// Report rejected files
const handleReject = (rejections: FileRejection[]) => {
    showMessageToast({ message: `${rejections.length} file(s) rejected: ${rejections.map(item => `${item.file.name} (${item.reason})`).join(', ')}`, type: 'warning' });
};

const textFieldCode = `<Field>
    <FieldLabel for="email">Email</FieldLabel>
    <FieldContent>
        <Input id="email" v-model="email" :aria-invalid="!!emailError" />
        <FieldError :errors="[emailError]" />
    </FieldContent>
</Field>`;

const comboboxCode = `<ComboboxSelect v-model="framework" :options="options" />
<ComboboxSelect v-model="stack" :options="options" multiple placeholder="Pick your stack" />`;

const checkboxCode = `<Checkbox v-model="accept" />
<Checkbox :model-value="'indeterminate'" />

<RadioGroup v-model="plan">
    <RadioGroupCard value="pro" label="Pro" description="For growing teams" :icon="Rocket01Icon" />
</RadioGroup>`;

const numberCode = `<NumberField v-model="seats" :min="1" :max="50" />
<NumberField v-model="price" :step="0.1" :format-options="{ style: 'currency', currency: 'EUR' }" />`;

const pinCode = `<PinInput v-model="code" :length="6" otp type="number" :separator-after="2" :invalid="invalid" @complete="verify" />`;

const tagsCode = `<TagsInput v-model="skills" placeholder="Add a skill..." />`;

const dropzoneCode = `<FileDropzone v-model="files" accept="image/*,.pdf" :max-size="5 * 1024 * 1024" :max-files="4" @reject="onReject" />`;
</script>

<template>
    <div class="flex flex-col gap-12">
        <DemoPageHeader eyebrow="Components" title="Forms" description="Every control shares the same field chrome: a soft primary focus ring, a shake on invalid input, and spring feedback on every interaction." :icon="InputTextIcon" />

        <!-- Text fields -->
        <DemoSection id="text-fields" title="Text fields" badge="Updated" description="Inputs and textareas with a focus ring. Invalid fields shake once and show animated field errors." :code="textFieldCode">
            <FieldGroup class="grid gap-6 md:grid-cols-2">
                <!-- Email with validation -->
                <Field>
                    <FieldLabel for="demo-email">Work email</FieldLabel>
                    <FieldContent>
                        <Input id="demo-email" v-model="email" type="email" placeholder="name@company.com" :aria-invalid="!!emailError || undefined" @blur="emailTouched = true" />
                        <FieldError :errors="[emailError]" />
                        <FieldDescription v-if="!emailError">We'll send the invite to this address.</FieldDescription>
                    </FieldContent>
                </Field>

                <!-- Disabled -->
                <Field>
                    <FieldLabel for="demo-workspace">Workspace URL</FieldLabel>
                    <FieldContent>
                        <Input id="demo-workspace" model-value="vintage.app/acme" disabled />
                        <FieldDescription>Contact an admin to change the workspace URL.</FieldDescription>
                    </FieldContent>
                </Field>

                <!-- Textarea with counter -->
                <Field class="md:col-span-2">
                    <FieldLabel for="demo-bio">Bio</FieldLabel>
                    <FieldContent>
                        <Textarea id="demo-bio" v-model="bio" maxlength="160" placeholder="Tell us about yourself" />
                        <FieldDescription class="flex justify-between">
                            <span>Shown on your public profile.</span>
                            <span :class="['tabular-nums transition-colors', bio.length > 140 ? 'text-warning' : '']">{{ bio.length }}/160</span>
                        </FieldDescription>
                    </FieldContent>
                </Field>
            </FieldGroup>
        </DemoSection>

        <!-- Select -->
        <DemoSection id="select" title="Select" badge="Updated" description="The trigger keeps its focus ring while open and its chevron flips with a spring; the checkmark pops on the selected item.">
            <div class="grid gap-6 md:grid-cols-2">
                <Field>
                    <FieldLabel>Deployment region</FieldLabel>
                    <Select v-model="region">
                        <SelectTrigger class="w-full">
                            <SelectValueContent placeholder="Choose a region" :icon="selectedRegion?.icon" :label="selectedRegion?.label" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Regions</SelectLabel>
                                <SelectItem v-for="option in regionOptions" :key="option.value" :value="option.value" :text-value="option.label">
                                    <SelectItemContent :icon="option.icon" :label="option.label" :description="option.description" />
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>

                <Field>
                    <FieldLabel>Small trigger</FieldLabel>
                    <Select default-value="weekly">
                        <SelectTrigger size="sm" class="w-full">
                            <SelectValueContent placeholder="Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
            </div>
        </DemoSection>

        <!-- Combobox -->
        <DemoSection id="combobox" title="Combobox" badge="New" description="Searchable select with instant filtering, rich options, and a multiple mode where tags pop in and out." :code="comboboxCode">
            <div class="grid gap-6 md:grid-cols-2">
                <Field>
                    <FieldLabel>Framework</FieldLabel>
                    <ComboboxSelect v-model="framework" :options="frameworkOptions" placeholder="Search frameworks" />
                </Field>
                <Field>
                    <FieldLabel>Your stack</FieldLabel>
                    <ComboboxSelect v-model="stack" :options="frameworkOptions" multiple placeholder="Pick your stack" />
                </Field>
            </div>
        </DemoSection>

        <!-- Checkbox and radio -->
        <DemoSection id="checkbox-radio" title="Checkbox & radio" badge="New" description="Check marks draw themselves, the indeterminate dash sweeps in, and radio dots bounce. Card radios take a primary outline and tint when selected." :code="checkboxCode">
            <div class="grid gap-8 lg:grid-cols-2">
                <div class="flex flex-col gap-5">
                    <!-- Terms -->
                    <div class="flex items-center gap-3">
                        <Checkbox id="demo-terms" v-model="acceptTerms" />
                        <Label for="demo-terms">I accept the terms and conditions</Label>
                    </div>

                    <!-- Parent / children with indeterminate -->
                    <div class="flex flex-col gap-3 rounded border border-border bg-surface/50 p-4">
                        <div class="flex items-center gap-3">
                            <Checkbox id="demo-all" :model-value="allNotifications" @update:model-value="toggleAllNotifications" />
                            <Label for="demo-all">All notifications</Label>
                        </div>
                        <div class="ml-8 flex flex-col gap-3">
                            <div class="flex items-center gap-3">
                                <Checkbox id="demo-mentions" v-model="notifications.mentions" />
                                <Label for="demo-mentions" class="font-normal">Mentions and replies</Label>
                            </div>
                            <div class="flex items-center gap-3">
                                <Checkbox id="demo-digest" v-model="notifications.digest" />
                                <Label for="demo-digest" class="font-normal">Weekly digest</Label>
                            </div>
                            <div class="flex items-center gap-3">
                                <Checkbox id="demo-product" v-model="notifications.product" />
                                <Label for="demo-product" class="font-normal">Product updates</Label>
                            </div>
                        </div>
                    </div>

                    <!-- Simple radios -->
                    <RadioGroup v-model="shipping" orientation="horizontal">
                        <div v-for="option in ['standard', 'express', 'overnight']" :key="option" class="flex items-center gap-2">
                            <RadioGroupItem :id="`ship-${option}`" :value="option" />
                            <Label :for="`ship-${option}`" class="capitalize">{{ option }}</Label>
                        </div>
                    </RadioGroup>
                </div>

                <!-- Card radios -->
                <RadioGroup v-model="plan">
                    <RadioGroupCard value="starter" label="Starter" description="1 project · Community support" :icon="StarIcon" />
                    <RadioGroupCard value="pro" label="Pro · €49/mo" description="Unlimited projects · Priority support" :icon="Rocket01Icon" />
                    <RadioGroupCard value="enterprise" label="Enterprise" description="SSO, audit logs, dedicated manager" :icon="Building03Icon" />
                </RadioGroup>
            </div>
        </DemoSection>

        <!-- Switch and slider -->
        <DemoSection id="switch-slider" title="Switch & slider" badge="Updated" description="The switch thumb squishes while pressed and springs across. Slider thumbs fill with a light tint as you hover and drag.">
            <div class="grid gap-8 lg:grid-cols-2">
                <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between gap-4 rounded border border-border bg-card p-4">
                        <div>
                            <Label for="demo-auto-deploy">Auto-deploy</Label>
                            <p class="mt-1 text-xs text-muted-foreground">Ship every push to main.</p>
                        </div>
                        <Switch id="demo-auto-deploy" v-model="autoDeploy" />
                    </div>
                    <SwitchFormComponent id="demo-preview" v-model="previewBranches" label="Preview branches" description="Create a preview URL for every pull request." />
                    <SliderFormComponent id="demo-budget" v-model="budget" label="Monthly budget" :min="100" :max="5000" :step="50" :value-text="`€${budget}`" description="Alerts fire at 80% of the budget." />
                </div>

                <div class="flex flex-col justify-center gap-8 px-2">
                    <div class="flex flex-col gap-3">
                        <div class="flex justify-between text-xs font-semibold"><span>Volume</span><span class="tabular-nums text-muted-foreground">{{ volume[0] }}%</span></div>
                        <Slider v-model="volume" :max="100" />
                    </div>
                    <div class="flex flex-col gap-3">
                        <div class="flex justify-between text-xs font-semibold"><span>Price range</span><span class="tabular-nums text-muted-foreground">€{{ range[0] }} – €{{ range[1] }}</span></div>
                        <Slider v-model="range" :max="100" :min-steps-between-thumbs="5" />
                    </div>
                </div>
            </div>
        </DemoSection>

        <!-- Number field -->
        <DemoSection id="number-field" title="Number field" badge="New" description="Digits slide up when incrementing and down when decrementing. Supports Intl formatting, bounds, and wheel input." :code="numberCode">
            <div class="grid gap-6 sm:grid-cols-2">
                <Field>
                    <FieldLabel>Seats</FieldLabel>
                    <NumberField v-model="seats" :min="1" :max="50" />
                    <FieldDescription>Between 1 and 50 seats.</FieldDescription>
                </Field>
                <Field>
                    <FieldLabel>Price</FieldLabel>
                    <NumberField v-model="price" :min="0" :step="0.1" :format-options="{ style: 'currency', currency: 'EUR' }" />
                    <FieldDescription>Formatted as currency.</FieldDescription>
                </Field>
            </div>
        </DemoSection>

        <!-- PIN input -->
        <DemoSection id="pin-input" title="PIN input" badge="New" description="One-time codes with paste support. Characters pop in; a wrong code shakes the row. Try 424242." :code="pinCode">
            <div class="flex flex-col items-center gap-4 py-4">
                <PinInput v-model="code" :length="6" otp type="number" :separator-after="2" :invalid="codeInvalid" @complete="handleCodeComplete" @update:model-value="codeInvalid = false" />
                <p class="text-xs text-muted-foreground">Enter the 6-digit code from your authenticator app.</p>
            </div>
        </DemoSection>

        <!-- Tags input -->
        <DemoSection id="tags-input" title="Tags input" badge="New" description="Press Enter to add, Backspace to select and remove. Tags pop in with a bounce." :code="tagsCode">
            <Field class="max-w-xl">
                <FieldLabel>Skills</FieldLabel>
                <TagsInput v-model="skills" placeholder="Add a skill..." />
            </Field>
        </DemoSection>

        <!-- Date and time -->
        <DemoSection id="date-time" title="Date & time" description="Calendar popovers with month and year navigation, plus native time inputs styled to match.">
            <div class="grid gap-6 md:grid-cols-3">
                <Field>
                    <FieldLabel>Start date</FieldLabel>
                    <DatePicker class="w-full" />
                </Field>
                <Field>
                    <FieldLabel>Reminder</FieldLabel>
                    <TimePicker v-model="reminder" />
                </Field>
                <Field class="md:col-span-3">
                    <FieldLabel>Meeting</FieldLabel>
                    <DateTimePicker v-model="meeting" class="w-full" />
                </Field>
            </div>
        </DemoSection>

        <!-- File dropzone -->
        <DemoSection id="file-dropzone" title="File dropzone" badge="New" description="Drag files over the zone: the border starts marching, the icon lifts, and the list animates as files come and go." :code="dropzoneCode">
            <div class="mx-auto max-w-2xl">
                <FileDropzone v-model="files" accept="image/*,.pdf" :max-size="5 * 1024 * 1024" :max-files="4" @reject="handleReject" />
            </div>
        </DemoSection>

        <!-- Submit bar -->
        <div class="flex flex-col gap-3 rounded border border-border bg-card p-4 shadow-elevated-sm sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3 text-xs text-muted-foreground">
                <HugeiconsIcon :icon="Mail01Icon" class="size-4" />
                Changes are only kept in this demo.
            </div>
            <div class="flex gap-3">
                <Button variant="secondary">Reset</Button>
                <Button @click="showMessageToast({ title: 'Saved', message: 'Your preferences have been updated.', type: 'success' })">
                    <HugeiconsIcon :icon="CreditCardIcon" />
                    Save changes
                </Button>
            </div>
        </div>
    </div>
</template>