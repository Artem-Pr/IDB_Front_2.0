import type { UploadResult, Uppy, UppyFile } from '@uppy/core'
import type { TusOptions } from '@uppy/tus'

import type { MimeTypes } from 'src/common/constants'

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
export type CurrentUppyFile = UppyFile<Metadata, Body>
export type TusOpt = TusOptions<Metadata, Body>

export interface UppyInstanceConstructor {
  // currentStore: ReduxStore,
  isFileAlreadyExist: (currentFile: CurrentUppyFile) => boolean
  isGlobalDropZone?: boolean
  onComplete?: (result: UploadResult<Metadata, Body>) => void
  onUploadError?: (file: CurrentUppyFile | undefined, error: Error) => void
  onUploadStart?: (file: CurrentUppyFile[]) => void
  onUploadSuccess?: (file: CurrentUppyFile | undefined, response: NonNullable<CurrentUppyFile['response']>) => void
  processResponse: (uploadedMedia: Media) => void
}
