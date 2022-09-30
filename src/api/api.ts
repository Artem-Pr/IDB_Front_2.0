import { AxiosResponse } from 'axios'

import {
  AxiosPreviews,
  CheckedDirectoryRequest,
  ExifFilesList,
  FetchingGalleryContent,
  QueryResponse,
  UpdatedObject,
  UpdatePhotosRequest,
  UploadingObject,
} from '../redux/types'
import { MatchingNumberOfFilesTest, MatchingVideoFilesTest } from '../redux/types/testPageTypes'
import { MimeTypes } from '../redux/types/MimeTypes'

import { instance } from './api-client'

export const mainApi = {
  sendPhotos(files: UploadingObject[], path: string): Promise<AxiosResponse<QueryResponse>> {
    return instance.post(`/upload?path=${path}`, files)
  },

  updatePhotos(files: UpdatedObject[]): Promise<AxiosResponse<UpdatePhotosRequest>> {
    return instance.put('/update', files)
  },

  sendPhoto(file: any): Promise<AxiosResponse<AxiosPreviews>> {
    const formData = new FormData()
    formData.append('filedata', file)

    return instance.post('/uploadItem', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getKeywordsList(): Promise<AxiosResponse<string[]>> {
    return instance.get('/keywords')
  },

  getPathsList(): Promise<AxiosResponse<string[]>> {
    return instance.get('/paths')
  },

  checkDirectory(directory: string): Promise<AxiosResponse<CheckedDirectoryRequest>> {
    return instance.get('/check-directory', {
      params: { directory },
    })
  },

  getKeywordsFromPhoto(tempPath: string[]): Promise<AxiosResponse<ExifFilesList>> {
    // need to get something even if exif is not exist
    return instance.post('/image-exif', tempPath)
  },

  getPhotosByTags(
    page: number,
    perPage: number,
    searchTags: string[] | undefined,
    excludeTags: string[] | undefined,
    mimeTypes: MimeTypes[] | undefined,
    folderPath: string | undefined,
    showSubfolders: boolean,
    isNameComparison?: boolean,
    comparisonFolder?: string
  ): Promise<AxiosResponse<FetchingGalleryContent>> {
    const params = {
      page,
      perPage,
      searchTags,
      excludeTags,
      mimeTypes,
      folderPath,
      showSubfolders,
      isNameComparison,
      comparisonFolder,
    }
    return instance.post('/filtered-photos', params)
  },

  deletePhoto(_id: string): Promise<AxiosResponse<QueryResponse>> {
    return instance.delete(`/photo/${_id}`)
  },

  deleteDirectory(directory: string): Promise<AxiosResponse<QueryResponse & { filePaths: string[] }>> {
    return instance.delete(`/directory`, {
      params: { name: directory },
    })
  },
}

export const testApi = {
  matchNumberOfFiles(pid: number): Promise<AxiosResponse<MatchingNumberOfFilesTest>> {
    return instance.post(`/test/matching-files`, { pid })
  },
  matchVideoFiles(pid: number): Promise<AxiosResponse<MatchingVideoFilesTest>> {
    return instance.post(`/test/matching-videos`, { pid })
  },
  rebuildFoldersConfig(): Promise<AxiosResponse<QueryResponse>> {
    return instance.get('/rebuild-paths-config')
  },
}
