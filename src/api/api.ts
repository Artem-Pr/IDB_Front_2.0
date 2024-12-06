import type { RcFile } from 'antd/es/upload'

import type {
  FetchingGalleryContent,
  QueryResponse,
} from 'src/redux/types'
import type { MatchingNumberOfFilesTest, MatchingVideoFilesTest } from 'src/redux/types/testPageTypes'

import { instance, instanceNewDB } from './api-client'
import type { Media } from './models/media'
import type { GetPhotosByTagsAPIRequest, UpdatedFileAPIRequest } from './types/request-types'
import type {
  CheckedDirectoryAPIResponse,
  CheckOriginalNameDuplicatesAPIResponse,
  DeleteDirectoryApiResponse,
  UploadingFileAPIResponse,
} from './types/response-types'

export const mainApi = {
  savePhotosInDB(files: UpdatedFileAPIRequest[]) {
    return instanceNewDB.post<Media[]>('/save-files', { files })
  },

  updatePhotos(files: UpdatedFileAPIRequest[]) {
    return instanceNewDB.put<Media[]>('/update-files', { files })
  },

  savePhotoInTempPool(file: string | Blob | RcFile) {
    const formData = new FormData()
    formData.append('filedata', file)

    return instanceNewDB.post<UploadingFileAPIResponse>('/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getKeywordsList() {
    return instanceNewDB.get<string[]>('/keywords')
  },

  getUnusedKeywordsList() {
    return instanceNewDB.get<string[]>('/unused-keywords')
  },

  checkDuplicates(fileNameArr: string[]) {
    return instanceNewDB.get<CheckOriginalNameDuplicatesAPIResponse>('check-duplicates', {
      params: { originalNames: fileNameArr },
    })
  },

  removeKeyword(keyword: string) {
    return instanceNewDB.delete(`/keyword/${keyword}`)
  },

  getPathsList() {
    return instanceNewDB.get<string[]>('/paths')
  },

  checkDirectory(directory: string) {
    return instanceNewDB.get<CheckedDirectoryAPIResponse>('/check-directory', {
      params: { directory },
    })
  },

  getPhotosByTags(params: GetPhotosByTagsAPIRequest) {
    return instanceNewDB.post<FetchingGalleryContent>('/filtered-photos', params)
  },

  deleteFiles(ids: string[]) {
    return instanceNewDB.post<undefined>('/delete-files', { ids })
  },

  deleteDirectory(directory: string) {
    return instanceNewDB.delete<DeleteDirectoryApiResponse>('/directory', {
      params: { directory },
    })
  },

  cleanTemp() {
    return instanceNewDB.delete('/clean-temp')
  },
}

export const testApi = {
  matchNumberOfFiles(pid: number) {
    return instance.post<MatchingNumberOfFilesTest>('/test/matching-files', { pid })
  },
  matchVideoFiles(pid: number) {
    return instance.post<MatchingVideoFilesTest>('/test/matching-videos', { pid })
  },
  rebuildFoldersConfig() {
    return instance.get<QueryResponse>('/rebuild-paths-config')
  },
}
