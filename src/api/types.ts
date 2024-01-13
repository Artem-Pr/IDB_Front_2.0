import { MimeTypes } from '../redux/types/MimeTypes'
import { Sort, SortedFields } from '../redux/types'

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

export enum API_STATUS {
  DEFAULT = 'default',
  INIT = 'init',
  PENDING = 'pending',
  PENDING_SUCCESS = 'pending-success',
  PENDING_ERROR = 'pending-error',
  DONE = 'done',
  ERROR = 'error',
  STOPPED = 'stopped',
}

export enum WEB_SOCKET_ACTIONS {
  SYNC_PREVIEWS = 'SYNC_PREVIEWS',
  CREATE_PREVIEWS = 'CREATE_PREVIEWS',
  CREATE_PREVIEWS_STOP = 'CREATE_PREVIEWS_STOP',
  FILES_TEST = 'FILES_TEST',
}

export interface WebSocketAPICallback<T = undefined> {
  progress: number
  message: string
  status: API_STATUS
  data: T
}

export interface WebSocketAPIRequest<T = undefined> {
  action: WEB_SOCKET_ACTIONS
  data: WebSocketAPICallback<T>
}

export interface WebSocketAPIQuery {
  action: WEB_SOCKET_ACTIONS
  data?: {
    folderPath?: string
    mimeTypes?: MimeTypes[]
  }
}
