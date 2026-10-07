import type { InjectionKey, Ref } from 'vue';
import { computed, inject, onBeforeUnmount, provide, ref, useAttrs, useId } from 'vue';

interface FieldContext {
    // Id of the control the field label points to (undefined until a control registers)
    controlId: Ref<string | undefined>;
    // Id of the field label, for controls that combine it with their own text
    labelId: Ref<string | undefined>;
}

const fieldContextKey: InjectionKey<FieldContext> = Symbol('uv-field');

// Share the label target with the label and the control inside a Field
export const provideFieldContext = () => {
    const context: FieldContext = { controlId: ref(undefined), labelId: ref(undefined) };
    provide(fieldContextKey, context);
    return context;
};

// Id the FieldLabel should point to, if the field has a control, and the id the label registers for itself
export const useFieldLabel = () => {
    const field = inject(fieldContextKey, null);
    const labelId = `uv-field-label-${useId()}`;
    if (field && !field.labelId.value) {
        field.labelId.value = labelId;
        onBeforeUnmount(() => {
            if (field.labelId.value === labelId) field.labelId.value = undefined;
        });
    }
    return {
        labelId: field ? labelId : undefined,
        target: computed(() => field?.controlId.value)
    };
};

// Id of the surrounding Field label, if any
export const useFieldLabelId = () => {
    const field = inject(fieldContextKey, null);
    return computed(() => field?.labelId.value);
};

// Give the first control inside a Field an id its FieldLabel points to (an explicit id on the control wins)
export const useFieldControlId = (explicitId?: () => string | undefined) => {
    const field = inject(fieldContextKey, null);
    const attrs = useAttrs();
    const generatedId = `uv-field-control-${useId()}`;

    // Only the first control claims the label, so composite controls (like DateTimePicker) don't fight over it
    if (!field || field.controlId.value) {
        return computed(() => explicitId?.());
    }

    const id = (explicitId?.() ?? (attrs.id as string | undefined)) || generatedId;
    field.controlId.value = id;

    // Release the label when the control goes away
    onBeforeUnmount(() => {
        if (field.controlId.value === id) field.controlId.value = undefined;
    });

    return computed(() => id);
};
