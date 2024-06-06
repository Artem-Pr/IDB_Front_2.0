import type { Tags } from 'exiftool-vendored'

export interface FullExifPayload {
  tempPath: string
  fullExifObj: Tags
}
