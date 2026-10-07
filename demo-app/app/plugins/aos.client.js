import { nextTick } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default defineNuxtPlugin(nuxtApp => {
    let isInitialized = false;

    // Initialize AOS with desired settings (only once)
    const initAOS = () => {
        // Skip if page:finish or onNuxtReady already initialized it
        if (isInitialized) return;

        // Initialize AOS
        AOS.init({
            duration: 1000,
            easing: 'ease-out-sine',
            once: true,
            offset: 60
        });

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