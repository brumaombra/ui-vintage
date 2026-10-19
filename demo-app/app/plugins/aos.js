import { nextTick } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Reveal settings of this app
const AOS_SETTINGS = {
	duration: 1000,
	easing: 'ease-out-sine',
	once: true,
	offset: 60
};

// Show the animated elements as they are when the user asks for reduced motion (the AOS "disable" option only covers the elements present at startup)
const REDUCED_MOTION_STYLE = '@media (prefers-reduced-motion: reduce){[data-aos]{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}}';

export default defineNuxtPlugin(nuxtApp => {
	// Keep the elements visible for reduced motion, already in the server-rendered page
	useHead({ style: [{ key: 'aos-reduced-motion', innerHTML: REDUCED_MOTION_STYLE }] });

	// Run AOS in the browser only
	if (import.meta.server) return;
	let isInitialized = false;

	// Initialize AOS with the app settings (only once, and not at all when the user asks for reduced motion)
	const initAOS = () => {
		// Skip if page:finish or onNuxtReady already initialized it, or if the user asks for reduced motion
		if (isInitialized || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		// Initialize AOS
		AOS.init(AOS_SETTINGS);

		// Mark AOS as initialized
		isInitialized = true;
	};

	// Refresh AOS to detect new elements or changes
	const refreshAOS = () => {
		// If AOS is already initialized, just refresh it
		if (isInitialized) {
			AOS.refreshHard();
			return;
		}

		// If not initialized yet, initialize it
		initAOS();
	};

	// Delay AOS until Nuxt is fully ready and one paint has passed
	onNuxtReady(() => {
		requestAnimationFrame(() => {
			nextTick(() => {
				initAOS();
			});
		});
	});

	// Refresh animated elements after route/content updates
	nuxtApp.hook('page:finish', () => {
		nextTick(() => {
			refreshAOS();
		});
	});
});