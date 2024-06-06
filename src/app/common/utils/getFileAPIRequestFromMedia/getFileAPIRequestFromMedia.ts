import type { UpdatedFileAPIRequest } from 'src/api/dto/request-types'
import type { Media } from 'src/api/models/media'

import { removeExtraFirstSlash } from '../utils'

export const getFileAPIRequestFromMedia = (media: Media, updatedFolderPath?: string): UpdatedFileAPIRequest => {
  const updatedFilePath: Media['filePath'] = updatedFolderPath
    ? `/${removeExtraFirstSlash(updatedFolderPath)}/${media.originalName}`
    : media.filePath

  return {
    id: media.id,
    updatedFields: {
      changeDate: media.changeDate,
      description: media.description,
      filePath: updatedFilePath,
      keywords: media.keywords,
      originalDate: media.originalDate,
      originalName: media.originalName,
      rating: media.rating,
      timeStamp: media.timeStamp,
    },
  }
}

export const getFileAPIRequestFromMediaList = (mediaList: Media[], updatedFolderPath?: string): UpdatedFileAPIRequest[] => (
  mediaList.map((media: Media) => getFileAPIRequestFromMedia(media, updatedFolderPath))
)
