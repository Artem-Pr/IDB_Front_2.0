import { MimeTypes } from '../redux/types/MimeTypes'
import { Sort, SortedFields } from '../redux/types'

export interface GetPhotosByTagsRequest {
  page: number
  perPage: number
  sorting: Partial<Record<SortedFields, Sort>>
  fileName?: string
  searchTags?: string[]
  excludeTags?: string[]
  mimeTypes?: MimeTypes[]
  folderPath?: string
  comparisonFolder?: string
  isNameComparison?: boolean
  showSubfolders?: boolean
  isFullSizePreview?: boolean
  randomSort?: boolean
  dontSavePreview?: boolean
}

export enum API_STATUS {
  DEFAULT = 'default',
  INIT = 'init',
  PENDING = 'pending',
  PENDING_SUCCESS = 'pending-success',
  PENDING_ERROR = 'pending-error',
  DONE = 'done',
  ERROR = 'error',
}

export enum WEB_SOCKET_ACTIONS {
  SYNC_PREVIEWS = 'SYNC_PREVIEWS',
}

export interface WebSocketAPICallback {
  progress: number
  message: string
}

export interface WebSocketAPIRequest {
  action: WEB_SOCKET_ACTIONS
  data: WebSocketAPICallback & {
    status: API_STATUS
  }
}
