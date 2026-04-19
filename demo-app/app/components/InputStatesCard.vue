<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brumaombra/ui-vintage/card';
import { DateTimePicker } from '@brumaombra/ui-vintage/date-time-picker';
import { Field, FieldContent, FieldGroup, FieldLabel } from '@brumaombra/ui-vintage/field';
import { Input } from '@brumaombra/ui-vintage/input';
import { Select, SelectContent, SelectItem, SelectItemText, SelectTrigger, SelectValue } from '@brumaombra/ui-vintage/select';
import { SliderFormComponent } from '@brumaombra/ui-vintage/slider-form-component';
import { SwitchFormComponent } from '@brumaombra/ui-vintage/switch-form-component';

// Two-way models for each input field
const nameModel = defineModel<string>('name', { required: true });
const networkModel = defineModel<string>('network', { required: true });
const alertsEnabledModel = defineModel<boolean>('alertsEnabled', { required: true });
const confidenceModel = defineModel<number>('confidence', { required: true });
const scheduleModel = defineModel<Date | null>('schedule', { default: null });
</script>

<template>
    <Card>
        <!-- Card header -->
        <CardHeader>
            <CardTitle>Input States</CardTitle>
            <CardDescription>
                Small form controls for spacing, borders, and typography checks.
            </CardDescription>
        </CardHeader>

        <!-- Card content -->
        <CardContent>
            <FieldGroup>
                <!-- Text input field -->
                <Field>
                    <FieldLabel>Display name</FieldLabel>
                    <FieldContent>
                        <Input id="demo-name" v-model="nameModel" placeholder="Enter a display name" />
                    </FieldContent>
                </Field>

                <!-- Network select field -->
                <Field>
                    <FieldLabel>Network</FieldLabel>
                    <FieldContent>
                        <Select v-model="networkModel">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Choose a network" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bitcoin">
                                    <SelectItemText>Bitcoin</SelectItemText>
                                </SelectItem>
                                <SelectItem value="kaspa">
                                    <SelectItemText>Kaspa</SelectItemText>
                                </SelectItem>
                                <SelectItem value="litecoin">
                                    <SelectItemText>Litecoin</SelectItemText>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel>Date and time</FieldLabel>
                    <FieldContent>
                        <DateTimePicker v-model="scheduleModel" class="w-full" />
                    </FieldContent>
                </Field>

                <!-- Switch control -->
                <SwitchFormComponent
                    id="demo-alerts-enabled"
                    v-model="alertsEnabledModel"
                    label="Enable alerts"
                    description="Preview switch track and thumb styling."
                />

                <!-- Slider control -->
                <SliderFormComponent
                    id="demo-confidence"
                    v-model="confidenceModel"
                    label="Confidence"
                    :description="`Current value: ${confidenceModel}%`"
                    :max="100"
                    :step="1"
                    :value-text="`${confidenceModel}%`"
                />
            </FieldGroup>
        </CardContent>
    </Card>
</template>