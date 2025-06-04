import type { UppyOptionsWithOptionalRestrictions } from '@uppy/core/lib/Uppy'
import type { TusOpts } from '@uppy/tus'
import { v4 as uuidV4 } from 'uuid'

import { MimeTypes } from 'src/common/constants'

import { HOST } from '../config'

import type { Metadata, Body } from './uppyTypes'

const MAX_FILE_SIZE = 10 // GB
const TUS_ENDPOINT = `${HOST.HTTP}/tus/upload`
const TUS_CHUNK_SIZE = 10 // MB
const TUS_LIMIT_CONCURRENT_UPLOADS = 10
const ALLOWED_METADATA_FIELDS: Array<keyof Metadata> = ['name', 'type', 'changeDate', 'size']

export const uppyOptions: Omit<UppyOptionsWithOptionalRestrictions<Metadata, Body>, 'onBeforeFileAdded'> = {
  id: uuidV4(),
  autoProceed: true,
  allowMultipleUploadBatches: true,
  debug: process.env.NODE_ENV === 'development',
  restrictions: {
    maxFileSize: MAX_FILE_SIZE * 1024 * 1024 * 1024,
    allowedFileTypes: Object.values(MimeTypes),
  },
}

export const tusOptions: Omit<TusOpts<Metadata, Body>, 'onAfterResponse'> = {
  endpoint: TUS_ENDPOINT,
  chunkSize: TUS_CHUNK_SIZE * 1024 * 1024,
  limit: TUS_LIMIT_CONCURRENT_UPLOADS,
  retryDelays: [0, 1000], // Retry delays in milliseconds
  allowedMetaFields: ALLOWED_METADATA_FIELDS,
}
