import { afterEach, describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { h } from 'vue';
import { LineChart } from '@brumaombra/ui-vintage/line-chart';

// A stepped chance over four days (one point a day)
const DAY = 24 * 60 * 60 * 1000;
const start = Date.UTC(2026, 9, 1);
const history = [[start, 50], [start + DAY, 62], [start + 2 * DAY, 41], [start + 3 * DAY, 55]];
const formatPercent = value => `${Math.round(value)}%`;

// Press a key on the plot (the arrow keys move between the points)
const press = async (wrapper, key) => {
	await wrapper.find('[data-slot="line-chart-plot"]').trigger('keydown', { key });
};

// Line chart: an SVG chart of a value over time
describe('LineChart', () => {
	let wrapper;

	// Unmount the chart
	afterEach(() => {
		wrapper?.unmount();
	});

	// A step chart holds each value until the next point
	it('draws steps, or straight segments', async () => {
		wrapper = await mountSuspended(LineChart, { props: { data: history, curve: 'step', min: 0, max: 100 } });
		const stepped = wrapper.find('[data-slot="line-chart-line"]').attributes('d');
		expect(stepped).toMatch(/^M 0 500 H 333\.\d+ V 380/);
		await wrapper.setProps({ curve: 'linear' });
		expect(wrapper.find('[data-slot="line-chart-line"]').attributes('d')).toMatch(/^M 0 500 L 333\.\d+ 380/);
	});

	// The points can come in any order: the line follows time
	it('sorts the points by time', async () => {
		wrapper = await mountSuspended(LineChart, { props: { data: [...history].reverse(), min: 0, max: 100 } });
		expect(wrapper.find('[data-slot="line-chart-line"]').attributes('d')).toMatch(/^M 0 500 /);
	});

	// The value labels use the given ticks and format, and the reference line shows inside the range
	it('labels the grid and draws the reference line', async () => {
		wrapper = await mountSuspended(LineChart, { props: { data: history, min: 0, max: 100, yTicks: [0, 50, 100], referenceLine: 50, formatY: formatPercent } });
		expect(wrapper.text()).toContain('0%');
		expect(wrapper.text()).toContain('50%');
		expect(wrapper.text()).toContain('100%');
		expect(wrapper.find('[data-slot="line-chart-reference"]').exists()).toBe(true);
		await wrapper.setProps({ referenceLine: 150 });
		expect(wrapper.find('[data-slot="line-chart-reference"]').exists()).toBe(false);
	});

	// Without a min and a max, the range widens to round steps, so grid lines frame the line
	it('rounds the automatic range', async () => {
		wrapper = await mountSuspended(LineChart, { props: { data: [[start, 430], [start + DAY, 1380]], formatY: value => String(value) } });
		const labels = wrapper.findAll('[aria-hidden="true"] span.absolute').map(label => label.text()).filter(Boolean);
		expect(labels).toContain('250');
		expect(labels).toContain('1500');
	});

	// The live dot marks the last point, unless turned off
	it('marks the last point', async () => {
		wrapper = await mountSuspended(LineChart, { props: { data: history, min: 0, max: 100 } });
		const style = wrapper.find('[data-slot="line-chart-last-point"]').attributes('style');
		expect(Number(style.match(/left: ([\d.]+)%/)[1])).toBeCloseTo(100);
		expect(Number(style.match(/top: ([\d.]+)%/)[1])).toBeCloseTo(45);
		await wrapper.setProps({ showLastPoint: false });
		expect(wrapper.find('[data-slot="line-chart-last-point"]').exists()).toBe(false);
	});

	// The arrow keys show the tooltip of each point, and Escape hides it
	it('moves the tooltip with the keyboard', async () => {
		wrapper = await mountSuspended(LineChart, { props: { data: history, min: 0, max: 100, formatY: formatPercent } });
		expect(wrapper.find('[data-slot="line-chart-tooltip"]').exists()).toBe(false);
		await press(wrapper, 'End');
		expect(wrapper.find('[data-slot="line-chart-tooltip"]').text()).toContain('55%');
		await press(wrapper, 'ArrowLeft');
		expect(wrapper.find('[data-slot="line-chart-tooltip"]').text()).toContain('41%');
		await press(wrapper, 'Home');
		expect(wrapper.find('[data-slot="line-chart-tooltip"]').text()).toContain('50%');
		await press(wrapper, 'Escape');
		expect(wrapper.find('[data-slot="line-chart-tooltip"]').exists()).toBe(false);
	});

	// A finger "leaves" as soon as it lifts: the tooltip of a tap stays, the mouse leaving hides it
	it('keeps the tooltip after a tap', async () => {
		wrapper = await mountSuspended(LineChart, { props: { data: history, min: 0, max: 100 } });
		const plot = wrapper.find('[data-slot="line-chart-plot"]');
		await press(wrapper, 'End');
		plot.element.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'touch' }));
		await wrapper.vm.$nextTick();
		expect(wrapper.find('[data-slot="line-chart-tooltip"]').exists()).toBe(true);
		plot.element.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
		await wrapper.vm.$nextTick();
		expect(wrapper.find('[data-slot="line-chart-tooltip"]').exists()).toBe(false);
	});

	// The tooltip slot replaces the default content and gets the point
	it('renders a custom tooltip', async () => {
		wrapper = await mountSuspended(LineChart, {
			props: { data: history, min: 0, max: 100 },
			slots: { tooltip: ({ point }) => h('p', { class: 'custom-tooltip' }, `YES ${point[1]}`) }
		});
		await press(wrapper, 'End');
		expect(wrapper.find('.custom-tooltip').text()).toBe('YES 55');
	});

	// A long history is thinned before drawing, keeping where it starts and ends
	it('thins very long histories', async () => {
		const long = Array.from({ length: 6000 }, (_, index) => [start + index * 60000, index % 100]);
		wrapper = await mountSuspended(LineChart, { props: { data: long, curve: 'step', min: 0, max: 100 } });
		const path = wrapper.find('[data-slot="line-chart-line"]').attributes('d');
		expect(path.split('H').length - 1).toBeLessThanOrEqual(1500);
		expect(path.startsWith('M 0 1000')).toBe(true);
		expect(path.endsWith(`V ${(1 - 99 / 100) * 1000}`)).toBe(true);
	});

	// Without data there is a grid but no line, no dot and no tooltip
	it('handles an empty history', async () => {
		wrapper = await mountSuspended(LineChart, { props: { data: [], min: 0, max: 100 } });
		expect(wrapper.find('[data-slot="line-chart-line"]').exists()).toBe(false);
		expect(wrapper.find('[data-slot="line-chart-last-point"]').exists()).toBe(false);
		await press(wrapper, 'End');
		expect(wrapper.find('[data-slot="line-chart-tooltip"]').exists()).toBe(false);
	});

	// A single point is a flat line across the chart
	it('draws a single point as a flat line', async () => {
		wrapper = await mountSuspended(LineChart, { props: { data: [[start, 30]], min: 0, max: 100 } });
		expect(wrapper.find('[data-slot="line-chart-line"]').attributes('d')).toBe('M 0 700 H 1000');
	});
});