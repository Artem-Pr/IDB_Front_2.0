import axios, { AxiosResponse } from 'axios'

import {
  AxiosPreviews,
  ExifFilesList,
  FetchingGalleryContent,
  UpdatedObject,
  UpdatePhotosRequest,
  UploadingObject,
} from '../redux/types'

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

const mainApi = {
  sendPhotos(files: UploadingObject[], path: string): Promise<AxiosResponse<string>> {
    return instance.post(`/upload?path=${path}`, files, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  updatePhotos(files: UpdatedObject[]): Promise<AxiosResponse<UpdatePhotosRequest>> {
    return instance.put('/update', files, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  sendPhoto(file: any): Promise<AxiosResponse<AxiosPreviews>> {
    const formData = new FormData()
    formData.append('filedata', file)

    return instance.post('/uploadItem', formData)
  },

  getKeywordsList(): Promise<AxiosResponse<string[]>> {
    return instance.get('/keywords')
  },

  getPathsList(): Promise<AxiosResponse<string[]>> {
    return instance.get('/paths')
  },

  getKeywordsFromPhoto(tempPath: string[]): Promise<AxiosResponse<ExifFilesList>> {
    // need to get something even if exif is not exist
    return instance.post('/image-exif', tempPath, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  getPhotosByTags(
    page: number,
    perPage: number,
    searchTags: string[] | undefined,
    excludeTags: string[] | undefined
  ): Promise<AxiosResponse<FetchingGalleryContent>> {
    return instance.get('/filtered-photos', {
      params: { page, perPage, searchTags, excludeTags },
    })
  },
}

export default mainApi
