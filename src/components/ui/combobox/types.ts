import type { HugeiconsIconDefinition } from '../../../lib/common-types';

// Primitive value held by a ComboboxSelect option
export type ComboboxSelectValue = string | number;

// Option rendered by ComboboxSelect
export interface ComboboxSelectOption {
    value: ComboboxSelectValue;
    label: string;
    description?: string;
    icon?: HugeiconsIconDefinition;
    disabled?: boolean;
}

// v-model shape of ComboboxSelect (array when `multiple`)
export type ComboboxSelectModelValue = ComboboxSelectValue | ComboboxSelectValue[] | null | undefined;