import { HttpStatusCode } from 'axios'

import { MimeTypes } from 'src/common/constants'

import type { Media } from '../models/media'

export interface ErrorResponse<T extends unknown = unknown> {
  cause?: T
  message: string
  path: string
  statusCode: HttpStatusCode
  timestamp: string
}

export enum ApiStatus {
  READY = 'ready',
  INIT = 'init',
  PENDING = 'pending',
  PENDING_SUCCESS = 'pending-success',
  PENDING_ERROR = 'pending-error',
  DONE = 'done',
  ERROR = 'error',
  STOPPED = 'stopped',
}

export enum WebSocketActions {
  CREATE_PREVIEWS = 'CREATE_PREVIEWS',
  CREATE_PREVIEWS_STOP = 'CREATE_PREVIEWS_STOP',
  FILES_TEST = 'FILES_TEST',
  SYNC_PREVIEWS = 'SYNC_PREVIEWS',
  UNKNOWN_ACTION = 'UNKNOWN_ACTION',
  UPDATE_EXIF = 'UPDATE_EXIF',
  UPDATE_EXIF_STOP = 'UPDATE_EXIF_STOP',
}

export interface WebSocketAPICallback<T = undefined> {
  progress?: number
  message: string
  status: ApiStatus
  data?: T
}

export interface WebSocketAPIRequest<T = undefined> {
  action: WebSocketActions
  data: WebSocketAPICallback<T>
}

export interface WebSocketAPIQuery {
  action: WebSocketActions
  data?: {
    folderPath?: string
    mimeTypes?: MimeTypes[]
  }
}

interface StaticPaths {
  staticPath: string;
  staticPreview: string;
  staticVideoFullSize?: string | null;
}

export interface DuplicateFile extends StaticPaths, Pick<Media, 'filePath' | 'originalName' | 'mimetype' | 'exif'> {}
