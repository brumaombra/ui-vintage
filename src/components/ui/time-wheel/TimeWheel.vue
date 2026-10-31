<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { haptic as playHaptic } from '../../../lib/haptics';
import { cn } from '../../../lib/utils';

// Props (the time as "HH:MM", the minutes offered every minuteStep, plus the minute of the value when it is off the step; haptic: a light tap on phones at each value that reaches the band)
const props = withDefaults(defineProps<{
	modelValue?: string;
	minuteStep?: number;
	hourLabel?: string;
	minuteLabel?: string;
	disabled?: boolean;
	haptic?: boolean;
	class?: HTMLAttributes['class'];
}>(), {
	modelValue: '',
	minuteStep: 5,
	disabled: false,
	haptic: true
});

// Emits
const emits = defineEmits<{
	(e: 'update:modelValue', payload: string): void;
}>();

const { t } = useI18n();

// Height of a row, in pixels (the band in the middle is one row)
const ROW_HEIGHT = 40;

// Columns
const hourColumn = ref<HTMLElement | null>(null);
const minuteColumn = ref<HTMLElement | null>(null);
let settleTimers: Record<'hour' | 'minute', ReturnType<typeof setTimeout> | null> = { hour: null, minute: null };
let isScrollingInCode = false;
const bandIndexes: Record<'hour' | 'minute', number> = { hour: -1, minute: -1 }; // Row of each column in the band, so a tap plays once per value scrolled through

// Play the tap of a value reaching the band
const playTick = () => {
	if (props.haptic) playHaptic('tap');
};

// Parse a time ("18:05" -> { hour: 18, minute: 5 }), midnight when there is none
const parseTime = (value: string) => {
	const [hour, minute] = (value || '').split(':').map(part => Number(part));
	return {
		hour: Number.isInteger(hour) && hour >= 0 && hour < 24 ? hour : 0,
		minute: Number.isInteger(minute) && minute >= 0 && minute < 60 ? minute : 0
	};
};

// Write a time ("18:05")
const formatTime = (hour: number, minute: number) => `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

// Current hour and minute
const current = computed(() => parseTime(props.modelValue));

// Values of each column (the minutes on the step, and the current minute when it is off it, e.g. 23:59)
const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = computed(() => {
	const step = Math.max(1, Math.min(30, Math.floor(props.minuteStep)));
	const values = Array.from({ length: Math.ceil(60 / step) }, (_, index) => index * step);
	if (!values.includes(current.value.minute)) values.push(current.value.minute);
	return values.sort((a, b) => a - b);
});

// Labels of the columns, for screen readers
const resolvedHourLabel = computed(() => props.hourLabel || t('uiVintage.timeWheel.hours'));
const resolvedMinuteLabel = computed(() => props.minuteLabel || t('uiVintage.timeWheel.minutes'));

// Set a part of the time
const setPart = (part: 'hour' | 'minute', value: number) => {
	const next = part === 'hour' ? formatTime(value, current.value.minute) : formatTime(current.value.hour, value);
	if (next !== props.modelValue) emits('update:modelValue', next);
};

// Scroll a column to its value (smoothly after a tap or a key, at once when the value comes from outside)
const scrollToValue = (part: 'hour' | 'minute', behavior: ScrollBehavior = 'auto') => {
	const column = part === 'hour' ? hourColumn.value : minuteColumn.value;
	const values = part === 'hour' ? hours : minutes.value;
	const index = values.indexOf(part === 'hour' ? current.value.hour : current.value.minute);
	if (!column || index < 0) return;
	bandIndexes[part] = index;
	isScrollingInCode = true;
	column.scrollTo({ top: index * ROW_HEIGHT, behavior });
	setTimeout(() => { isScrollingInCode = false; }, behavior === 'smooth' ? 400 : 50);
};

// Tick at each value that reaches the band, and pick the one in the band once a column stops scrolling
const handleScroll = (part: 'hour' | 'minute') => {
	if (isScrollingInCode || props.disabled) return;

	// Tick when the band holds another value (Android only while the finger scrolls: iOS plays the taps of a tap, not of a scroll)
	const scrolledColumn = part === 'hour' ? hourColumn.value : minuteColumn.value;
	const scrolledValues = part === 'hour' ? hours : minutes.value;
	if (scrolledColumn) {
		const bandIndex = Math.min(scrolledValues.length - 1, Math.max(0, Math.round(scrolledColumn.scrollTop / ROW_HEIGHT)));
		if (bandIndex !== bandIndexes[part]) {
			bandIndexes[part] = bandIndex;
			playTick();
		}
	}

	// Pick the value once the scrolling stops
	if (settleTimers[part]) clearTimeout(settleTimers[part]);
	settleTimers[part] = setTimeout(() => {
		const column = part === 'hour' ? hourColumn.value : minuteColumn.value;
		const values = part === 'hour' ? hours : minutes.value;
		if (!column) return;
		const index = Math.min(values.length - 1, Math.max(0, Math.round(column.scrollTop / ROW_HEIGHT)));
		setPart(part, values[index]);
	}, 120);
};

// Pick a value by tapping it
const pickValue = (part: 'hour' | 'minute', value: number) => {
	if (props.disabled) return;
	if (value !== (part === 'hour' ? current.value.hour : current.value.minute)) playTick();
	setPart(part, value);
};

// Move a column with the keyboard (arrows by one, page keys by a few, home and end to the ends)
const handleKeydown = (part: 'hour' | 'minute', event: KeyboardEvent) => {
	if (props.disabled) return;
	const values = part === 'hour' ? hours : minutes.value;
	const index = values.indexOf(part === 'hour' ? current.value.hour : current.value.minute);
	const moves: Record<string, number> = { ArrowUp: index - 1, ArrowDown: index + 1, PageUp: index - 3, PageDown: index + 3, Home: 0, End: values.length - 1 };
	if (!(event.key in moves)) return;
	event.preventDefault();
	const next = values[Math.min(values.length - 1, Math.max(0, moves[event.key]))];
	if (next !== values[index]) playTick();
	setPart(part, next);
};

// Follow the value: a tap or a key scrolls smoothly, a value from outside jumps there
watch(() => props.modelValue, async () => {
	await nextTick();
	scrollToValue('hour', 'smooth');
	scrollToValue('minute', 'smooth');
});

// Start on the value
onMounted(() => {
	scrollToValue('hour');
	scrollToValue('minute');
});

// Stop pending timers
onBeforeUnmount(() => {
	if (settleTimers.hour) clearTimeout(settleTimers.hour);
	if (settleTimers.minute) clearTimeout(settleTimers.minute);
	settleTimers = { hour: null, minute: null };
});

// Classes of a value in a column
const getValueClass = (selected: boolean) => cn('flex h-10 w-full shrink-0 cursor-pointer snap-center items-center justify-center font-mono text-xl tabular-nums transition-colors', selected ? 'font-bold text-foreground' : 'text-muted-foreground hover:text-foreground');
</script>

<template>
	<!-- Two wheels, hours and minutes, with a band on the value in the middle -->
	<div data-slot="time-wheel" :class="cn('relative mx-auto flex max-w-60 items-center justify-center gap-2 rounded border border-border bg-card py-1', props.disabled && 'pointer-events-none opacity-50', props.class)">
		<!-- The band of the chosen time -->
		<div class="pointer-events-none absolute inset-x-2 top-1/2 h-10 -translate-y-1/2 rounded bg-primary/10 ring-1 ring-primary/40 ring-inset" aria-hidden="true"></div>

		<!-- Hours -->
		<div ref="hourColumn" data-slot="time-wheel-hours" role="spinbutton" :tabindex="props.disabled ? -1 : 0" :aria-label="resolvedHourLabel" :aria-valuenow="current.hour" aria-valuemin="0" aria-valuemax="23" :aria-valuetext="String(current.hour).padStart(2, '0')" :aria-disabled="props.disabled || undefined" class="uv-focus-ring relative h-40 w-20 snap-y snap-mandatory overflow-y-auto rounded scrollbar-none [mask-image:linear-gradient(transparent,black_30%,black_70%,transparent)]" @scroll="handleScroll('hour')" @keydown="handleKeydown('hour', $event)">
			<div class="h-15" aria-hidden="true"></div>
			<div v-for="hour in hours" :key="hour" :class="getValueClass(hour === current.hour)" :data-value="hour" aria-hidden="true" @click="pickValue('hour', hour)">{{ String(hour).padStart(2, '0') }}</div>
			<div class="h-15" aria-hidden="true"></div>
		</div>

		<span class="relative font-mono text-xl font-bold" aria-hidden="true">:</span>

		<!-- Minutes -->
		<div ref="minuteColumn" data-slot="time-wheel-minutes" role="spinbutton" :tabindex="props.disabled ? -1 : 0" :aria-label="resolvedMinuteLabel" :aria-valuenow="current.minute" aria-valuemin="0" aria-valuemax="59" :aria-valuetext="String(current.minute).padStart(2, '0')" :aria-disabled="props.disabled || undefined" class="uv-focus-ring relative h-40 w-20 snap-y snap-mandatory overflow-y-auto rounded scrollbar-none [mask-image:linear-gradient(transparent,black_30%,black_70%,transparent)]" @scroll="handleScroll('minute')" @keydown="handleKeydown('minute', $event)">
			<div class="h-15" aria-hidden="true"></div>
			<div v-for="minute in minutes" :key="minute" :class="getValueClass(minute === current.minute)" :data-value="minute" aria-hidden="true" @click="pickValue('minute', minute)">{{ String(minute).padStart(2, '0') }}</div>
			<div class="h-15" aria-hidden="true"></div>
		</div>
	</div>
</template>