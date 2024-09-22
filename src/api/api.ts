import type { RcFile } from 'antd/es/upload'

import type {
  FetchingGalleryContent,
  QueryResponse,
} from 'src/redux/types'
import type { MatchingNumberOfFilesTest, MatchingVideoFilesTest } from 'src/redux/types/testPageTypes'

import { instance, instanceNewDB } from './api-client'
import type { UpdatedFileAPIRequest } from './dto/request-types'
import type {
  CheckedDirectoryAPIResponse, CheckOriginalNameDuplicatesAPIResponse, UpdatePhotosAPIResponse, UploadingFileAPIResponse,
} from './dto/response-types'
import type { Media } from './models/media'
import type { GetPhotosByTagsRequest } from './types'

export const mainApi = {
  savePhotosInDB(files: UpdatedFileAPIRequest[]) {
    return instanceNewDB.post<Media[]>('/save-files', { files })
  },

  updatePhotos(files: UpdatedFileAPIRequest[]) {
    return instance.put<UpdatePhotosAPIResponse>('/update', files)
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
    return instance.get<string[]>('/unused-keywords')
  },

  checkDuplicates(fileNameArr: string[]) {
    return instanceNewDB.get<CheckOriginalNameDuplicatesAPIResponse>('check-duplicates', {
      params: { originalNames: fileNameArr },
    })
  },

  removeKeyword(keyword: string) {
    return instance.delete(`/keyword/${keyword}`)
  },

  getPathsList() {
    return instanceNewDB.get<string[]>('/paths')
  },

  checkDirectory(directory: string) {
    return instanceNewDB.get<CheckedDirectoryAPIResponse>('/check-directory', {
      params: { directory },
    })
  },

  getPhotosByTags(params: GetPhotosByTagsRequest) {
    return instance.post<FetchingGalleryContent>('/filtered-photos', params)
  },

  deletePhoto(_id: string) {
    return instance.delete<QueryResponse>(`/photo/${_id}`)
  },

  deleteDirectory(directory: string) {
    return instance.delete<QueryResponse & { filePaths: string[] }>('/directory', {
      params: { name: directory },
    })
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
