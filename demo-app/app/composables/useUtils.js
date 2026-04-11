import { defineComponent, h } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';

// Create a reusable Hugeicons-backed Vue component for prop-based icon APIs.
export const createIconComponent = icon => defineComponent({
    name: icon?.name || icon?.iconName || 'AppIcon',
    inheritAttrs: false,
    setup(_, { attrs }) {
        return () => h(HugeiconsIcon, {
            icon,
            color: 'currentColor',
            strokeWidth: attrs.strokeWidth ?? attrs['stroke-width'] ?? 1.8,
            ...attrs
        });
    }
});