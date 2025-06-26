import type { RcFile } from 'antd/es/upload'

import type {
  FetchingGalleryContent,
  QueryResponse,
} from 'src/redux/types'
import type { MatchingNumberOfFilesTest } from 'src/redux/types/testPageTypes'

import type { Media } from '../models/media'
import type { 
  GetExifKeysAPIRequest,
  GetExifValuesAPIRequest,
  GetExifValueRangeAPIRequest,
  GetFilesDescriptionAPIRequest, 
  GetPhotosByTagsAPIRequest, 
  UpdatedFileAPIRequest 
} from '../types/request-types'
import type {
  CheckedDirectoryAPIResponse,
  CheckOriginalNameDuplicatesAPIResponse,
  DeleteDirectoryApiResponse,
  GetExifKeysAPIResponse,
  GetExifValuesAPIResponse,
  GetExifValueRangeAPIResponse,
  GetFilesDescriptionAPIResponse,
  UpdatedFileAPIResponse,
  UploadingFileAPIResponse,
} from '../types/response-types'

import { APIInstance } from './../api-instance'
import { RequestUrl } from './api-requests-url-list'
import { getPermissions } from './getPermissions'
import { login } from './login'
import { logout } from './logout'
import { refreshTokens } from './refreshTokens'

export const authApi = {
  login,
  logout,
  refreshTokens,
  getPermissions,
}

export const mainApi = {
  savePhotosInDB(files: UpdatedFileAPIRequest[]) {
    return APIInstance.post<Media[]>(RequestUrl.SAVE_FILES, { files })
  },

  updatePhotos(files: UpdatedFileAPIRequest[]) {
    return APIInstance.put<UpdatedFileAPIResponse>(RequestUrl.UPDATE_FILES, { files })
  },

  savePhotoInTempPool(file: string | Blob | RcFile) {
    const formData = new FormData()
    formData.append('filedata', file)

    return APIInstance.post<UploadingFileAPIResponse>(RequestUrl.UPLOAD_FILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getKeywordsList() {
    return APIInstance.get<string[]>(RequestUrl.KEYWORDS)
  },

  getUnusedKeywordsList() {
    return APIInstance.get<string[]>(RequestUrl.UNUSED_KEYWORDS)
  },

  checkDuplicates(fileNameArr: string[]) {
    return APIInstance.get<CheckOriginalNameDuplicatesAPIResponse>(RequestUrl.CHECK_DUPLICATES, {
      params: { originalNames: fileNameArr },
    })
  },

  removeKeyword(keyword: string) {
    return APIInstance.delete(`${RequestUrl.KEYWORD}/${keyword}`)
  },

  getPathsList() {
    return APIInstance.get<string[]>(RequestUrl.PATHS)
  },

  checkDirectory(directory: string) {
    return APIInstance.get<CheckedDirectoryAPIResponse>(RequestUrl.CHECK_DIRECTORY, {
      params: { directory },
    })
  },

  getPhotosByTags(params: GetPhotosByTagsAPIRequest) {
    return APIInstance.post<FetchingGalleryContent>(RequestUrl.FILTERED_PHOTOS, params)
  },

  deleteFiles(ids: string[]) {
    return APIInstance.post<undefined>(RequestUrl.DELETE_FILE, { ids })
  },

  deleteDirectory(directory: string) {
    return APIInstance.delete<DeleteDirectoryApiResponse>(RequestUrl.DIRECTORY, {
      params: { directory },
    })
  },

  getFilesDescription(params: GetFilesDescriptionAPIRequest) {
    return APIInstance.get<GetFilesDescriptionAPIResponse>(RequestUrl.FILES_DESCRIPTION, {
      params,
    })
  },

  getExifKeys(params: GetExifKeysAPIRequest) {
    return APIInstance.get<GetExifKeysAPIResponse>(RequestUrl.EXIF_KEYS, {
      params,
    })
  },

  getExifValues(params: GetExifValuesAPIRequest) {
    return APIInstance.get<GetExifValuesAPIResponse>(RequestUrl.EXIF_VALUES, {
      params,
    })
  },

  getExifValueRange(params: GetExifValueRangeAPIRequest) {
    return APIInstance.get<GetExifValueRangeAPIResponse>(RequestUrl.EXIF_VALUE_RANGE, {
      params,
    })
  },

  cleanTemp() {
    return APIInstance.delete(RequestUrl.CLEAN_TEMP)
  },
}

export const testApi = {
  matchNumberOfFiles(pid: number) {
    return APIInstance.get<MatchingNumberOfFilesTest>(RequestUrl.MATCHING_FILES, { params: { pid } })
  },
  rebuildFoldersConfig() {
    return APIInstance.get<QueryResponse>(RequestUrl.REBUILD_PATHS_CONFIG)
  },
}
