<script setup lang="ts">
import { computed, onMounted, ref, type HTMLAttributes } from 'vue';
import { useI18n } from 'vue-i18n';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';
import { useCookieConsent } from './useCookieConsent';

// Extra attributes go on the banner (the root is the Teleport)
defineOptions({ inheritAttrs: false });

// Props
const props = withDefaults(defineProps<{
    storageKey?: string;
    message?: string;
    policyTo?: string;
    policyLabel?: string;
    acceptLabel?: string;
    declineLabel?: string;
    class?: HTMLAttributes['class'];
}>(), {
    storageKey: 'cookieConsent',
    message: undefined,
    policyTo: undefined,
    policyLabel: undefined,
    acceptLabel: undefined,
    declineLabel: undefined,
    class: undefined
});

// Emits
const emit = defineEmits<{
    accept: [];
    decline: [];
}>();

const { t } = useI18n();
const { consent, accept, decline } = useCookieConsent(props.storageKey);
const hasMounted = ref(false);

// Shown in the browser only, until the visitor chooses (the stored choice is not known on the server)
const isVisible = computed(() => hasMounted.value && consent.value === null);

// Texts, with translated defaults
const resolvedMessage = computed(() => props.message || t('uiVintage.cookieConsent.message'));
const resolvedPolicyLabel = computed(() => props.policyLabel || t('uiVintage.cookieConsent.policy'));
const resolvedAcceptLabel = computed(() => props.acceptLabel || t('uiVintage.cookieConsent.accept'));
const resolvedDeclineLabel = computed(() => props.declineLabel || t('uiVintage.cookieConsent.decline'));

// Save the choice and notify
const handleAccept = () => {
    accept();
    emit('accept');
};
const handleDecline = () => {
    decline();
    emit('decline');
};

// Wait for the browser before showing the banner
onMounted(() => {
    hasMounted.value = true;
});
</script>

<template>
    <!-- Rendered in the body: a transformed or filtered ancestor (page transitions, reveal animations) would otherwise pin the fixed banner to itself instead of the viewport -->
    <Teleport to="body">
        <div v-if="isVisible" v-bind="$attrs" data-slot="cookie-consent" role="region" :aria-label="t('uiVintage.cookieConsent.region')" :class="cn('fixed inset-x-4 bottom-4 z-50 sm:left-auto sm:right-4 sm:max-w-md', props.class)">
            <Card class="gap-3! p-4 shadow-elevated-sm">
                <p class="text-sm text-foreground">
                    {{ resolvedMessage }}
                    <NuxtLinkLocale v-if="props.policyTo" :to="props.policyTo" class="font-semibold text-primary underline underline-offset-2">{{ resolvedPolicyLabel }}</NuxtLinkLocale>
                </p>
                <div class="flex flex-wrap justify-end gap-2">
                    <Button variant="secondary" size="sm" @click="handleDecline">{{ resolvedDeclineLabel }}</Button>
                    <Button variant="primary" size="sm" @click="handleAccept">{{ resolvedAcceptLabel }}</Button>
                </div>
            </Card>
        </div>
    </Teleport>
</template>