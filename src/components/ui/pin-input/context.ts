import type { ComputedRef, InjectionKey } from 'vue';

// Shared state provided by PinInput to its cells
export interface PinInputContext {
    invalid: ComputedRef<boolean>;
}

export const pinInputContextKey: InjectionKey<PinInputContext> = Symbol('uvPinInput');