import type { RcFile } from 'antd/es/upload'

import type {
  FetchingGalleryContent,
  QueryResponse,
} from 'src/redux/types'
import type { MatchingNumberOfFilesTest, MatchingVideoFilesTest } from 'src/redux/types/testPageTypes'

import { axiosInstance } from './api-client'
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
    return axiosInstance.post<Media[]>('/save-files', { files })
  },

  updatePhotos(files: UpdatedFileAPIRequest[]) {
    return axiosInstance.put<Media[]>('/update-files', { files })
  },

  savePhotoInTempPool(file: string | Blob | RcFile) {
    const formData = new FormData()
    formData.append('filedata', file)

    return axiosInstance.post<UploadingFileAPIResponse>('/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getKeywordsList() {
    return axiosInstance.get<string[]>('/keywords')
  },

  getUnusedKeywordsList() {
    return axiosInstance.get<string[]>('/unused-keywords')
  },

  checkDuplicates(fileNameArr: string[]) {
    return axiosInstance.get<CheckOriginalNameDuplicatesAPIResponse>('check-duplicates', {
      params: { originalNames: fileNameArr },
    })
  },

  removeKeyword(keyword: string) {
    return axiosInstance.delete(`/keyword/${keyword}`)
  },

  getPathsList() {
    return axiosInstance.get<string[]>('/paths')
  },

  checkDirectory(directory: string) {
    return axiosInstance.get<CheckedDirectoryAPIResponse>('/check-directory', {
      params: { directory },
    })
  },

  getPhotosByTags(params: GetPhotosByTagsAPIRequest) {
    return axiosInstance.post<FetchingGalleryContent>('/filtered-photos', params)
  },

  deleteFiles(ids: string[]) {
    return axiosInstance.post<undefined>('/delete-files', { ids })
  },

  deleteDirectory(directory: string) {
    return axiosInstance.delete<DeleteDirectoryApiResponse>('/directory', {
      params: { directory },
    })
  },

  cleanTemp() {
    return axiosInstance.delete('/clean-temp')
  },
}

export const testApi = {
  matchNumberOfFiles(pid: number) {
    return axiosInstance.get<MatchingNumberOfFilesTest>('test-system/matching-files', { params: { pid } })
  },
  matchVideoFiles(pid: number) {
    return axiosInstance.post<MatchingVideoFilesTest>('/test/matching-videos', { pid })
  },
  rebuildFoldersConfig() {
    return axiosInstance.get<QueryResponse>('/rebuild-paths-config')
  },
}
