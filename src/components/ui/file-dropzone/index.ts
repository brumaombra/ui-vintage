export { default as FileDropzone } from './FileDropzone.vue';

export type FileRejectionReason = 'type' | 'size' | 'count';

export type FileRejection = {
    file: File;
    reason: FileRejectionReason;
};

// Format a byte count as a human readable size (1024 based)
export function formatFileSize(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** exponent;

    // One decimal for small values, none for bytes or large values
    const digits = exponent === 0 || value >= 10 ? 0 : 1;
    return `${value.toFixed(digits)} ${units[exponent]}`;
}

// Check a file against an accept string (".pdf,image/*,application/json")
export function isFileAccepted(file: File, accept: string | undefined): boolean {
    if (!accept) return true;
    const tokens = accept.split(',').map(token => token.trim().toLowerCase()).filter(Boolean);
    if (tokens.length === 0) return true;

    const name = file.name.toLowerCase();
    const type = (file.type || '').toLowerCase();
    return tokens.some((token) => {
        if (token.startsWith('.')) return name.endsWith(token);
        if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
        return type === token;
    });
}