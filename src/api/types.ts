import { Sort, SortedFields } from '../redux/types'
import { MimeTypes } from '../redux/types/MimeTypes'

export interface GetPhotosByTagsRequest {
  comparisonFolder?: string
  dontSavePreview?: boolean
  excludeTags?: string[]
  fileName?: string
  folderPath?: string
  isDynamicFolders?: boolean
  isFullSizePreview?: boolean
  isNameComparison?: boolean
  mimeTypes?: MimeTypes[]
  page: number
  perPage: number
  randomSort?: boolean
  searchTags?: string[]
  showSubfolders?: boolean
  sorting: Partial<Record<SortedFields, Sort>>
}

export enum ApiStatus {
  DEFAULT = 'default',
  INIT = 'init',
  PENDING = 'pending',
  PENDING_SUCCESS = 'pending-success',
  PENDING_ERROR = 'pending-error',
  DONE = 'done',
  ERROR = 'error',
  STOPPED = 'stopped',
}

export enum WebSocketActions {
  SYNC_PREVIEWS = 'SYNC_PREVIEWS',
  CREATE_PREVIEWS = 'CREATE_PREVIEWS',
  CREATE_PREVIEWS_STOP = 'CREATE_PREVIEWS_STOP',
  FILES_TEST = 'FILES_TEST',
}

export interface WebSocketAPICallback<T = undefined> {
  progress: number
  message: string
  status: ApiStatus
  data: T
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
