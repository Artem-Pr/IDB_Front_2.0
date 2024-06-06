import type { ExifDateTime } from 'exiftool-vendored'

export const isObject = (value: unknown): value is Record<string, string | number> | ExifDateTime => Boolean(value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length)
