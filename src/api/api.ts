import type {
  AxiosPreviews,
  CheckedDirectoryRequest,
  ExifFilesList,
  ExistedFile,
  FetchingGalleryContent,
  QueryResponse,
  UpdatedObject,
  UpdatePhotosRequest,
  UploadingObject,
} from '../redux/types'
import type { MatchingNumberOfFilesTest, MatchingVideoFilesTest } from '../redux/types/testPageTypes'

import { instance } from './api-client'
import type { GetPhotosByTagsRequest } from './types'

export const mainApi = {
  sendPhotos(files: UploadingObject[], path: string) {
    return instance.post<QueryResponse>(`/upload?path=${path}`, files)
  },

  updatePhotos(files: UpdatedObject[]) {
    return instance.put<UpdatePhotosRequest>('/update', files)
  },

  sendPhoto(file: any) {
    const formData = new FormData()
    formData.append('filedata', file)

    return instance.post<AxiosPreviews>('/uploadItem', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getKeywordsList() {
    return instance.get<string[]>('/keywords')
  },

  getUnusedKeywordsList() {
    return instance.get<string[]>('/unused-keywords')
  },

  checkDuplicates(fileNameArr: string[]) {
    return instance.get<Record<string, ExistedFile[]>>('check-duplicates', {
      params: { names: fileNameArr },
    })
  },

  removeKeyword(keyword: string) {
    return instance.delete(`/keyword/${keyword}`)
  },

  getPathsList() {
    return instance.get<string[]>('/paths')
  },

  checkDirectory(directory: string) {
    return instance.get<CheckedDirectoryRequest>('/check-directory', {
      params: { directory },
    })
  },

  getKeywordsFromPhoto(tempPath: string[]) {
    // need to get something even if exif is not exist
    return instance.post<ExifFilesList>('/image-exif', tempPath)
  },

  getPhotosByTags(params: GetPhotosByTagsRequest) {
    return instance.post<FetchingGalleryContent>('/filtered-photos', params)
  },

  deletePhoto(_id: string) {
    return instance.delete<QueryResponse>(`/photo/${_id}`)
  },

  deleteDirectory(directory: string) {
    return instance.delete<QueryResponse & { filePaths: string[] }>(`/directory`, {
      params: { name: directory },
    })
  },
}

export const testApi = {
  matchNumberOfFiles(pid: number) {
    return instance.post<MatchingNumberOfFilesTest>(`/test/matching-files`, { pid })
  },
  matchVideoFiles(pid: number) {
    return instance.post<MatchingVideoFilesTest>(`/test/matching-videos`, { pid })
  },
  rebuildFoldersConfig() {
    return instance.get<QueryResponse>('/rebuild-paths-config')
  },
}
