import { JwtPayload } from 'jwt-decode'

import type { Media } from '../models/media'

import type { DuplicateFile } from './types'

export interface TokenPayload extends JwtPayload {
    email: string,
    role: string,
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface UploadingFileAPIResponse {
  properties: Media;
}

export interface CheckOriginalNameDuplicatesAPIResponse extends Record<Media['originalName'], DuplicateFile[]> {}

export interface UpdatedFileAPIResponse {
  response: Media[];
  errors: string[];
}

export interface CheckedDirectoryAPIResponse {
  numberOfFiles: number
  numberOfSubdirectories: number
}

export interface DeleteDirectoryApiResponse {
  directoriesToRemove: string[];
  mediaList: Media[];
}

export interface GetFilesDescriptionAPIResponse {
  descriptions: string[]
  page: number
  perPage: number
  resultsCount: number
  totalPages: number
}
