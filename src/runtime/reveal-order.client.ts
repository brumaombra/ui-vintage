import { defineNuxtPlugin } from 'nuxt/app';
import { computeRevealDelays, REVEAL_STEP_MS } from '../lib/reveal-order';

// The class AOS adds when it reveals an element
const ANIMATE_CLASS = 'aos-animate';

// Reveal the scroll-animated elements of the app in their on-screen order: what AOS (https://github.com/michalsnik/aos) reveals gets a short stagger from top to bottom and left to right, whatever the layout, and each pass waits for the one before (AOS checks the scroll about every 100ms, so a fast scroll reveals in several passes). Apps without AOS are not affected
export default defineNuxtPlugin(() => {
	// When the last element revealed so far starts appearing
	let lastRevealAt = 0;

	// Stagger the elements AOS has just revealed
	const handleMutations = (records: MutationRecord[]) => {
		// Elements that have just received the class (not the ones that had it already)
		const revealed = [...new Set(records
			.filter(record => record.target instanceof HTMLElement && record.target.classList.contains(ANIMATE_CLASS) && !(record.oldValue || '').split(/\s+/).includes(ANIMATE_CLASS))
			.map(record => record.target as HTMLElement))];
		if (!revealed.length) return;

		// Start after the elements of the previous pass that are still waiting
		const now = performance.now();
		const start = lastRevealAt > now ? lastRevealAt - now + REVEAL_STEP_MS : 0;
		// A single element with nothing waiting keeps its own timing
		if (revealed.length === 1 && start === 0) {
			lastRevealAt = now + (Number(revealed[0].dataset.aosDelay) || 0);
			return;
		}

		// Hold the reveal back while measuring: reading positions applies the styles, which would start the transitions with their old delays
		revealed.forEach(element => element.classList.remove(ANIMATE_CLASS));
		const delays = computeRevealDelays(revealed.map(element => {
			const rect = element.getBoundingClientRect();
			return { top: rect.top, left: rect.left, ownDelay: Number(element.dataset.aosDelay) || 0 };
		}), { start });
		lastRevealAt = now + Math.max(...delays);

		// Give each element its delay, then reveal them all again
		revealed.forEach((element, index) => {
			element.style.transitionDelay = `${delays[index]}ms`;
			element.classList.add(ANIMATE_CLASS);
		});

		// Skip the class changes made here, so they are not handled again
		observer.takeRecords();
	};

	// Watch the class changes of the whole page (AOS reveals elements by adding a class)
	const observer = new MutationObserver(handleMutations);
	observer.observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
});