<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { onClickOutside, useElementSize } from '@vueuse/core';
import { computed, onMounted, ref, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';

// A point of the chart: a timestamp (milliseconds) and its value
export type LineChartPoint = [number, number];

// Props
const props = withDefaults(defineProps<{
	data: LineChartPoint[];
	curve?: 'linear' | 'step';
	min?: number;
	max?: number;
	yTicks?: number[];
	referenceLine?: number;
	showLastPoint?: boolean;
	fill?: boolean;
	formatX?: (timestamp: number) => string;
	formatY?: (value: number) => string;
	formatTooltipX?: (timestamp: number) => string;
	locale?: string;
	ariaLabel?: string;
	class?: HTMLAttributes['class'];
}>(), {
	curve: 'linear',
	showLastPoint: true,
	fill: true
});

// The drawing space of the paths: the SVG stretches it to the size of the plot, so nothing has to be measured to draw (the strokes keep their width with vector-effect)
const VIEW_SIZE = 1000;

// More points than this are thinned to one per bucket before drawing (a long history has far more points than pixels)
const MAX_POINTS = 1500;

const { locale: appLocale } = useI18n();
const resolvedLocale = computed(() => props.locale || appLocale.value || 'en');
const gradientId = `uv-line-chart-${useId()}`;
const plotRef = ref<HTMLElement | null>(null);
const { width: plotWidth } = useElementSize(plotRef);
const isMounted = ref(false);
const activeIndex = ref<number | null>(null);

// The points in time order, thinned when there are too many (the last point of each bucket, so a step chart keeps its levels)
const points = computed<LineChartPoint[]>(() => {
	const sorted = [...props.data].filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y)).sort((first, second) => first[0] - second[0]);
	if (sorted.length <= MAX_POINTS) return sorted;
	const start = sorted[0][0];
	const span = sorted[sorted.length - 1][0] - start || 1;
	const buckets = new Map<number, LineChartPoint>();
	for (const point of sorted) buckets.set(Math.min(MAX_POINTS - 1, Math.floor((point[0] - start) / span * MAX_POINTS)), point);
	const thinned = [...buckets.values()];
	if (thinned[0] !== sorted[0]) thinned.unshift(sorted[0]); // Keep where the line starts
	return thinned;
});

// A round step for about four intervals across a range (1, 2, 2.5 or 5 times a power of ten)
const roundStep = (span: number) => {
	const rawStep = span / 4 || 1;
	const magnitude = 10 ** Math.floor(Math.log10(rawStep));
	return [1, 2, 2.5, 5, 10].map(factor => factor * magnitude).find(candidate => candidate >= rawStep) ?? rawStep;
};

// The range of the values: the given min and max, or the data widened to round steps, so a grid line frames the top and the bottom
const yRange = computed(() => {
	const values = points.value.map(([, y]) => y);
	const dataLow = values.length ? Math.min(...values) : 0;
	const dataHigh = values.length ? Math.max(...values) : 1;
	const step = roundStep(dataHigh - dataLow || Math.abs(dataHigh) || 1);
	let low = props.min ?? Math.floor(dataLow / step) * step;
	let high = props.max ?? Math.ceil(dataHigh / step) * step;
	if (low >= high) {
		if (props.max === undefined) high = low + step;
		else low = high - step;
	}
	return { low, high, step: props.min === undefined && props.max === undefined ? step : roundStep(high - low) };
});

// The range of the timestamps (a single point spans the whole width)
const xRange = computed(() => {
	const first = points.value[0]?.[0] ?? 0;
	const last = points.value[points.value.length - 1]?.[0] ?? first;
	return { first, last: last === first ? first + 1 : last };
});

// Position of a timestamp and of a value, from 0 to 1 (left to right, bottom to top)
const xRatio = (timestamp: number) => (timestamp - xRange.value.first) / (xRange.value.last - xRange.value.first);
const yRatio = (value: number) => (value - yRange.value.low) / (yRange.value.high - yRange.value.low);

// Coordinates in the drawing space (y grows downwards)
const viewX = (timestamp: number) => xRatio(timestamp) * VIEW_SIZE;
const viewY = (value: number) => (1 - yRatio(value)) * VIEW_SIZE;

// The line: straight segments, or steps that keep each value until the next point
const linePath = computed(() => {
	if (!points.value.length) return '';
	if (points.value.length === 1) return `M 0 ${viewY(points.value[0][1])} H ${VIEW_SIZE}`;
	return points.value.map(([x, y], index) => {
		if (index === 0) return `M ${viewX(x)} ${viewY(y)}`;
		return props.curve === 'step' ? `H ${viewX(x)} V ${viewY(y)}` : `L ${viewX(x)} ${viewY(y)}`;
	}).join(' ');
});

// The area under the line, closed along the bottom
const areaPath = computed(() => linePath.value ? `${linePath.value} V ${VIEW_SIZE} H ${points.value.length === 1 ? 0 : viewX(points.value[0][0])} Z` : '');

// The values with a grid line and a label: the given ones, or five round steps across the range
const gridValues = computed(() => {
	if (props.yTicks) return props.yTicks.filter(value => value >= yRange.value.low && value <= yRange.value.high);
	const { low, high, step } = yRange.value;
	const values = [];
	for (let value = Math.ceil(low / step) * step; value <= high + step * 1e-9; value += step) values.push(Number(value.toFixed(10)));
	return values;
});

// How long the chart spans, to pick the date format of the labels
const spansHours = computed(() => xRange.value.last - xRange.value.first < 36 * 60 * 60 * 1000);

// Default formats: numbers in the app language, dates as a day (or a time within a day and a half), and day and time in the tooltip
const formatYValue = (value: number) => props.formatY ? props.formatY(value) : new Intl.NumberFormat(resolvedLocale.value, { maximumFractionDigits: 2 }).format(value);
const formatXValue = (timestamp: number) => props.formatX ? props.formatX(timestamp) : new Intl.DateTimeFormat(resolvedLocale.value, spansHours.value ? { hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short' }).format(timestamp);
const formatTooltipXValue = (timestamp: number) => props.formatTooltipX ? props.formatTooltipX(timestamp) : new Intl.DateTimeFormat(resolvedLocale.value, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(timestamp);

// Labels along the time axis, evenly spaced: as many as fit the width (about one every 95px)
const xTicks = computed(() => {
	if (points.value.length < 2) return [];
	const count = Math.max(2, Math.min(6, Math.floor((plotWidth.value || 600) / 95)));
	return Array.from({ length: count }, (_, index) => {
		const ratio = index / (count - 1);
		return { ratio, label: formatXValue(xRange.value.first + ratio * (xRange.value.last - xRange.value.first)) };
	});
});

// The widest value label, which sizes the column of the labels
const widestYLabel = computed(() => gridValues.value.map(formatYValue).reduce((widest, label) => label.length > widest.length ? label : widest, ''));

// The point under the pointer (or chosen with the keyboard)
const activePoint = computed(() => activeIndex.value === null ? null : points.value[activeIndex.value] ?? null);

// Where the active point is, in percent of the plot
const activePosition = computed(() => activePoint.value ? { left: xRatio(activePoint.value[0]) * 100, top: (1 - yRatio(activePoint.value[1])) * 100 } : null);

// The tooltip goes right of the point, or left of it on the right half of the plot
const tooltipOnLeft = computed(() => (activePosition.value?.left ?? 0) > 55);

// The last point, marked with a live dot
const lastPosition = computed(() => {
	const last = points.value[points.value.length - 1];
	return last ? { left: points.value.length === 1 ? 100 : xRatio(last[0]) * 100, top: (1 - yRatio(last[1])) * 100 } : null;
});

// Find the point nearest to a timestamp (the points are sorted, so a binary search)
const findNearestIndex = (timestamp: number) => {
	let low = 0;
	let high = points.value.length - 1;
	while (low < high) {
		const middle = (low + high) >> 1;
		if (points.value[middle][0] < timestamp) low = middle + 1;
		else high = middle;
	}
	if (low > 0 && timestamp - points.value[low - 1][0] < points.value[low][0] - timestamp) return low - 1;
	return low;
};

// Follow the pointer (mouse, pen, or a finger dragging across the chart)
const handlePointer = (event: PointerEvent) => {
	if (!plotRef.value || !points.value.length) return;
	const rect = plotRef.value.getBoundingClientRect();
	if (!rect.width) return; // Not laid out (hidden)
	const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
	activeIndex.value = findNearestIndex(xRange.value.first + ratio * (xRange.value.last - xRange.value.first));
};

// Hide the tooltip (a touch turned into a scroll, a tap outside, the focus left)
const clearActive = () => {
	activeIndex.value = null;
};

// Hide the tooltip when the mouse leaves; a finger "leaves" as soon as it lifts, so after a tap the tooltip stays until a tap outside
const handlePointerLeave = (event: PointerEvent) => {
	if (event.pointerType !== 'touch') clearActive();
};
onClickOutside(plotRef, clearActive);

// Move between the points with the arrow keys, and hide the tooltip with Escape
const handleKeydown = (event: KeyboardEvent) => {
	if (!points.value.length) return;
	const last = points.value.length - 1;
	const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, Home: -Infinity, End: Infinity };
	if (event.key === 'Escape') {
		clearActive();
		return;
	}
	if (!(event.key in moves)) return;
	event.preventDefault();
	const current = activeIndex.value ?? last;
	activeIndex.value = Math.min(last, Math.max(0, current + moves[event.key]));
};

// The time labels wait for the browser: dates depend on the time zone of the visitor, which the server doesn't know
onMounted(() => {
	isMounted.value = true;
});
</script>

<template>
	<!-- Chart: value labels on the left, the plot, and time labels below -->
	<div data-slot="line-chart" role="figure" :aria-label="props.ariaLabel" :class="cn('grid h-72 w-full grid-cols-[auto_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] pt-2 text-xs text-muted-foreground tabular-nums', props.class)">
		<!-- Value labels (an invisible copy of the widest one gives the column its width) -->
		<div class="relative pr-2 text-right" aria-hidden="true">
			<span class="invisible block h-0 overflow-hidden">{{ widestYLabel }}</span>
			<span v-for="value in gridValues" :key="value" class="absolute right-2 -translate-y-1/2 whitespace-nowrap" :style="{ top: `${(1 - yRatio(value)) * 100}%` }">{{ formatYValue(value) }}</span>
		</div>

		<!-- Plot: follows the pointer, and the arrow keys once focused -->
		<div ref="plotRef" data-slot="line-chart-plot" class="relative touch-pan-y outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50" tabindex="0" @pointermove="handlePointer" @pointerdown="handlePointer" @pointerleave="handlePointerLeave" @pointercancel="clearActive" @keydown="handleKeydown" @blur="clearActive">
			<svg class="absolute inset-0 size-full overflow-visible text-primary" :viewBox="`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`" preserveAspectRatio="none" aria-hidden="true">
				<defs>
					<linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stop-color="currentColor" stop-opacity="0.32" />
						<stop offset="1" stop-color="currentColor" stop-opacity="0.02" />
					</linearGradient>
				</defs>

				<!-- Grid -->
				<line v-for="value in gridValues" :key="value" x1="0" :x2="VIEW_SIZE" :y1="viewY(value)" :y2="viewY(value)" class="stroke-border" stroke-dasharray="4 4" vector-effect="non-scaling-stroke" />

				<!-- Reference line (e.g. 50%), stronger than the grid -->
				<line v-if="props.referenceLine !== undefined && props.referenceLine >= yRange.low && props.referenceLine <= yRange.high" data-slot="line-chart-reference" x1="0" :x2="VIEW_SIZE" :y1="viewY(props.referenceLine)" :y2="viewY(props.referenceLine)" class="stroke-muted-foreground/60" stroke-dasharray="2 3" vector-effect="non-scaling-stroke" />

				<!-- Area and line -->
				<path v-if="props.fill && areaPath" :d="areaPath" :fill="`url(#${gradientId})`" />
				<path v-if="linePath" data-slot="line-chart-line" :d="linePath" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
			</svg>

			<!-- Live dot on the last point -->
			<span v-if="props.showLastPoint && lastPosition" data-slot="line-chart-last-point" class="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" :style="{ left: `${lastPosition.left}%`, top: `${lastPosition.top}%` }" aria-hidden="true">
				<span class="absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-ping" />
				<span class="relative block size-2 rounded-full bg-primary" />
			</span>

			<!-- Hovered point: guide line, dot, and tooltip -->
			<template v-if="activePoint && activePosition">
				<span class="pointer-events-none absolute inset-y-0 border-l border-dashed border-foreground/35" :style="{ left: `${activePosition.left}%` }" aria-hidden="true" />
				<span data-slot="line-chart-active-point" class="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-card" :style="{ left: `${activePosition.left}%`, top: `${activePosition.top}%` }" aria-hidden="true" />
				<div data-slot="line-chart-tooltip" role="status" :class="cn('pointer-events-none absolute z-10 -translate-y-1/2', tooltipOnLeft ? '-translate-x-full pr-3' : 'pl-3')" :style="{ left: `${activePosition.left}%`, top: `${Math.min(80, Math.max(20, activePosition.top))}%` }">
					<slot name="tooltip" :point="activePoint" :index="activeIndex">
						<div class="min-w-28 rounded border border-border bg-card px-3 py-2 text-card-foreground shadow-elevated-md">
							<p class="text-[0.6875rem] text-muted-foreground">{{ formatTooltipXValue(activePoint[0]) }}</p>
							<p class="mt-0.5 text-sm font-semibold tabular-nums">{{ formatYValue(activePoint[1]) }}</p>
						</div>
					</slot>
				</div>
			</template>
		</div>

		<!-- Time labels (the first and last one aligned to the edges of the plot) -->
		<div />
		<div class="relative h-6" aria-hidden="true">
			<template v-if="isMounted">
				<span v-for="(tick, index) in xTicks" :key="tick.ratio" :class="cn('absolute top-1.5 whitespace-nowrap', index === 0 ? '' : index === xTicks.length - 1 ? '-translate-x-full' : '-translate-x-1/2')" :style="{ left: `${tick.ratio * 100}%` }">{{ tick.label }}</span>
			</template>
		</div>
	</div>
</template>