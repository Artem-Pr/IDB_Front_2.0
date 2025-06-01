import type { Tags } from 'src/api/models/media'

export interface FullExifPayload {
  tempPath: string
  fullExifObj: Tags
}
