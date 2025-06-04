import type { UploadResult, Uppy, UppyFile } from '@uppy/core'

import { MimeTypes } from 'src/common/constants'

import type { FileNameWithExt, Media } from '../models/media'

export type Body = Record<string, unknown>
export type MetadataObject = {
  changeDate: number;
  filename: FileNameWithExt;
  filetype: MimeTypes;
  name: FileNameWithExt;
  size: number;
  type: MimeTypes;
}
export type Metadata = Partial<MetadataObject>
export type UppyType = Uppy<Metadata, Body>

export interface UppyInstanceConstructor {
  isFileAlreadyExist: (currentFile: UppyFile<Metadata, Body>) => boolean
  isGlobalDropZone?: boolean
  onComplete?: (result: UploadResult<Metadata, Body>) => void
  onUploadError?: (file: UppyFile<Metadata, Body> | undefined, error: Error) => void
  onUploadStart?: (file: UppyFile<Metadata, Body>[]) => void
  onUploadSuccess?: (file: UppyFile<Metadata, Body> | undefined, response: NonNullable<UppyFile<Metadata, Body>['response']>) => void
  processResponse: (uploadedMedia: Media) => void
  accessToken?: string
}
