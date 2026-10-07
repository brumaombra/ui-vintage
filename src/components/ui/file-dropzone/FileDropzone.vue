<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { HugeiconsIconDefinition } from '../../../lib/common-types';
import type { FileRejection } from '.';
import { Cancel01Icon, CloudUploadIcon, Doc01Icon, File01Icon, FileZipIcon, Image01Icon, MusicNote01Icon, Pdf01Icon, Video01Icon, Xls01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { cn } from '../../../lib/utils';
import { Button, buttonVariants } from '../button';
import { formatFileSize, isFileAccepted } from '.';

// Props
const props = withDefaults(defineProps<{
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    maxFiles?: number;
    disabled?: boolean;
    title?: string;
    description?: string;
    class?: HTMLAttributes['class'];
}>(), {
    multiple: true,
    disabled: false,
});

// Emits
const emits = defineEmits<{
    reject: [rejections: FileRejection[]];
}>();

// Selected files (v-model)
const files = defineModel<File[]>({ default: () => [] });

const { t } = useI18n();

const inputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isRejected = ref(false);
let dragDepth = 0;
let rejectTimer: ReturnType<typeof setTimeout> | undefined;

// Resolved texts
const resolvedTitle = computed(() => props.title || t('uiVintage.fileDropzone.title'));
const resolvedDescription = computed(() => props.description || t('uiVintage.fileDropzone.description'));

// Constraint hints shown under the description
const hints = computed(() => {
    const list: string[] = [];
    if (props.maxSize) list.push(t('uiVintage.fileDropzone.maxSize', { size: formatFileSize(props.maxSize) }));
    if (props.multiple && props.maxFiles) list.push(t('uiVintage.fileDropzone.maxFiles', { count: props.maxFiles }));
    return list;
});

// Stable keys for the file list
const fileIds = new WeakMap<File, number>();
let nextFileId = 0;
function getFileId(file: File) {
    if (!fileIds.has(file)) fileIds.set(file, nextFileId++);
    return fileIds.get(file)!;
}

// Pick an icon from the file type or extension
function getFileIcon(file: File): HugeiconsIconDefinition {
    const type = file.type.toLowerCase();
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (type.startsWith('image/')) return Image01Icon;
    if (type.startsWith('video/')) return Video01Icon;
    if (type.startsWith('audio/')) return MusicNote01Icon;
    if (type === 'application/pdf' || extension === 'pdf') return Pdf01Icon;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return FileZipIcon;
    if (['doc', 'docx', 'odt', 'rtf', 'txt', 'md'].includes(extension)) return Doc01Icon;
    if (['xls', 'xlsx', 'ods', 'csv'].includes(extension)) return Xls01Icon;
    return File01Icon;
}

// Briefly shake the drop zone when something is refused
function flashRejected() {
    isRejected.value = false;
    clearTimeout(rejectTimer);
    requestAnimationFrame(() => {
        isRejected.value = true;
        rejectTimer = setTimeout(() => (isRejected.value = false), 450);
    });
}

// Validate incoming files and merge them into the model
function addFiles(incoming: File[]) {
    if (props.disabled || incoming.length === 0) return;
    const rejections: FileRejection[] = [];
    const accepted: File[] = [];

    // Type and size checks
    for (const file of incoming) {
        if (!isFileAccepted(file, props.accept)) rejections.push({ file, reason: 'type' });
        else if (props.maxSize !== undefined && file.size > props.maxSize) rejections.push({ file, reason: 'size' });
        else accepted.push(file);
    }

    let next: File[];
    if (!props.multiple) {
        // Single mode keeps only the first valid file
        next = accepted.slice(0, 1);
        for (const file of accepted.slice(1)) rejections.push({ file, reason: 'count' });
        if (next.length === 0) next = [...files.value];
    } else {
        // Skip exact duplicates already in the list
        const isDuplicate = (file: File) => files.value.some(existing => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified);
        const fresh = accepted.filter(file => !isDuplicate(file));

        // Enforce the max file count
        const room = props.maxFiles !== undefined ? Math.max(0, props.maxFiles - files.value.length) : fresh.length;
        for (const file of fresh.slice(room)) rejections.push({ file, reason: 'count' });
        next = [...files.value, ...fresh.slice(0, room)];
    }

    if (next.length !== files.value.length || next.some((file, index) => file !== files.value[index])) files.value = next;
    if (rejections.length > 0) {
        emits('reject', rejections);
        flashRejected();
    }
}

// Remove a file from the list
function removeFile(file: File) {
    files.value = files.value.filter(existing => existing !== file);
}

// Open the native file picker
function openPicker() {
    if (props.disabled) return;
    inputRef.value?.click();
}

// Native picker selection
function onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    addFiles(Array.from(input.files ?? []));
    input.value = '';
}

// Drag tracking (depth counter avoids flicker when crossing child elements)
function onDragEnter(event: DragEvent) {
    if (props.disabled || !event.dataTransfer?.types.includes('Files')) return;
    dragDepth++;
    isDragging.value = true;
}

function onDragOver(event: DragEvent) {
    if (props.disabled || !event.dataTransfer) return;
    event.dataTransfer.dropEffect = 'copy';
}

function onDragLeave() {
    if (!isDragging.value) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) isDragging.value = false;
}

function onDrop(event: DragEvent) {
    dragDepth = 0;
    isDragging.value = false;
    if (props.disabled) return;
    addFiles(Array.from(event.dataTransfer?.files ?? []));
}

onBeforeUnmount(() => clearTimeout(rejectTimer));
</script>

<template>
    <div data-slot="file-dropzone" :class="cn('flex w-full flex-col gap-3', props.class)">
        <!-- Drop area -->
        <div role="button" :tabindex="props.disabled ? -1 : 0" :aria-disabled="props.disabled || undefined" :aria-label="resolvedTitle" :data-dragging="isDragging ? '' : undefined" :data-disabled="props.disabled ? '' : undefined" :class="cn(
            'group/dropzone relative isolate flex min-h-44 cursor-pointer select-none flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-border bg-surface/50 px-6 py-8 text-center outline-none',
            '[transition:border-color_150ms,background-color_220ms,box-shadow_220ms,transform_420ms_var(--ease-spring)]',
            'hover:border-border-strong hover:bg-surface focus-visible:ring-[3px] focus-visible:ring-ring/45 active:scale-[0.99] active:duration-75',
            'data-dragging:scale-[1.01] data-dragging:border-transparent data-dragging:bg-primary/5 data-dragging:hover:border-transparent data-dragging:hover:bg-primary/5',
            'data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:border-border data-disabled:hover:bg-surface/50 data-disabled:active:scale-100',
            isRejected && 'animate-uv-shake border-destructive/70'
        )" @click="openPicker" @keydown.enter.prevent="openPicker" @keydown.space.prevent="openPicker" @dragenter.prevent="onDragEnter" @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop.prevent="onDrop">
            <!-- Marching dashed border while dragging -->
            <span aria-hidden="true" class="uv-dropzone-ants pointer-events-none absolute -inset-0.5 rounded opacity-0 transition-opacity duration-150 group-data-dragging/dropzone:opacity-100" />

            <!-- Upload icon (lifts and grows while dragging) -->
            <span aria-hidden="true" class="relative flex size-14 items-center justify-center rounded border border-border bg-card text-muted-foreground shadow-elevated-sm transition-[translate,scale,color,border-color,box-shadow] duration-420 ease-bounce group-hover/dropzone:-translate-y-0.5 group-hover/dropzone:text-foreground group-data-dragging/dropzone:-translate-y-2 group-data-dragging/dropzone:scale-115 group-data-dragging/dropzone:border-primary/50 group-data-dragging/dropzone:text-primary group-data-dragging/dropzone:shadow-elevated-md">
                <HugeiconsIcon :icon="CloudUploadIcon" class="size-6" />
            </span>

            <!-- Texts -->
            <div class="flex flex-col items-center gap-1">
                <p class="text-xs font-semibold text-foreground sm:text-sm">
                    {{ isDragging ? t('uiVintage.fileDropzone.dropActive') : resolvedTitle }}
                </p>
                <p class="text-xs text-muted-foreground">{{ resolvedDescription }}</p>
                <p v-if="hints.length" class="text-xs text-muted-foreground/80">{{ hints.join(' · ') }}</p>
            </div>

            <!-- Browse hint (decorative, the whole zone is the button) -->
            <span aria-hidden="true" :class="cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'pointer-events-none transition-opacity group-data-dragging/dropzone:opacity-0')">
                {{ t('uiVintage.fileDropzone.browse') }}
            </span>

            <!-- Hidden native input -->
            <input ref="inputRef" type="file" class="hidden" tabindex="-1" :accept="props.accept" :multiple="props.multiple" :disabled="props.disabled" @change="onInputChange" @click.stop>
        </div>

        <!-- Selected files -->
        <TransitionGroup tag="ul" data-slot="file-dropzone-list" :aria-label="t('uiVintage.fileDropzone.files')" class="flex flex-col" enter-active-class="transition-[opacity,translate,filter] duration-420 ease-out-expo" enter-from-class="translate-y-2.5 opacity-0 blur-[3px]" leave-active-class="transition-[grid-template-rows,opacity,scale] duration-220 ease-snappy" leave-to-class="grid-rows-[0fr] scale-[0.98] opacity-0">
            <li v-for="file in files" :key="getFileId(file)" class="grid grid-rows-[1fr]">
                <div class="min-h-0 overflow-hidden">
                    <div class="pb-2">
                        <!-- File row -->
                        <div data-slot="file-dropzone-item" class="flex items-center gap-3 rounded border border-border bg-card py-2 pr-2 pl-3 shadow-elevated-sm">
                            <span class="flex size-9 shrink-0 items-center justify-center rounded-sm bg-surface text-muted-foreground">
                                <HugeiconsIcon :icon="getFileIcon(file)" class="size-4.5" />
                            </span>
                            <div class="flex min-w-0 flex-1 flex-col">
                                <span class="truncate text-xs font-semibold text-foreground sm:text-sm" :title="file.name">{{ file.name }}</span>
                                <span class="text-xs text-muted-foreground tabular-nums">{{ formatFileSize(file.size) }}</span>
                            </div>
                            <Button variant="ghost" size="icon-sm" :disabled="props.disabled" :aria-label="t('uiVintage.fileDropzone.remove', { name: file.name })" class="hover:text-destructive" @click="removeFile(file)">
                                <HugeiconsIcon :icon="Cancel01Icon" class="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </li>
        </TransitionGroup>
    </div>
</template>

<style>
/* Animated dashed border shown while files are dragged over the drop zone */
.uv-dropzone-ants {
    background-image:
        linear-gradient(90deg, var(--primary) 55%, transparent 0),
        linear-gradient(90deg, var(--primary) 55%, transparent 0),
        linear-gradient(0deg, var(--primary) 55%, transparent 0),
        linear-gradient(0deg, var(--primary) 55%, transparent 0);
    background-size: 16px 2px, 16px 2px, 2px 16px, 2px 16px;
    background-position: 0 0, 0 100%, 0 0, 100% 0;
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    animation: uv-dropzone-march 0.7s linear infinite;
}

@keyframes uv-dropzone-march {
    to { background-position: 16px 0, -16px 100%, 0 -16px, 100% 16px; }
}
</style>