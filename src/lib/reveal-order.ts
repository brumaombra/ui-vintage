// Gap between two elements revealed together, and the longest delay any of them waits
export const REVEAL_STEP_MS = 70;
export const REVEAL_MAX_DELAY_MS = 500;

// Elements whose tops are this close sit on the same row (cards of a grid, tags of a cloud)
const ROW_TOLERANCE_PX = 8;

// What the helper reads from each revealed element
interface RevealItem {
	top: number;
	left: number;
	ownDelay?: number; // The delay the element asks for itself (data-aos-delay), kept as a minimum
}

// Transition delays for elements revealed in the same pass, in their on-screen order: row by row from the top, left to right in a row. The order comes from the layout the visitor sees, so a grid staggers by its real columns at every width, and an element below another never appears first. "start" is where the first one begins: after the elements of the previous pass that are still waiting, so a fast scroll keeps one continuous order
export const computeRevealDelays = (items: RevealItem[], { start = 0, step = REVEAL_STEP_MS, max = REVEAL_MAX_DELAY_MS } = {}) => {
	// Sort by top, then group the tops that are close into rows
	const order = items.map((item, index) => ({ ...item, index })).sort((a, b) => a.top - b.top);
	const rows: Array<typeof order> = [];
	for (const item of order) {
		const row = rows[rows.length - 1];
		if (row && Math.abs(item.top - row[0].top) <= ROW_TOLERANCE_PX) row.push(item);
		else rows.push([item]);
	}

	// Number the elements row by row, left to right, and turn the position into a delay (never shorter than the element's own)
	const delays = new Array<number>(items.length);
	rows.flatMap(row => row.sort((a, b) => a.left - b.left)).forEach((item, position) => {
		delays[item.index] = Math.max(item.ownDelay || 0, Math.min(start + position * step, max));
	});
	return delays;
};