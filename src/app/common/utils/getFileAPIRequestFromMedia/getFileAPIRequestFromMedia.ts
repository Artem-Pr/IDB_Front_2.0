import type { Media } from 'src/api/models/media'
import type { UpdatedFileAPIRequest } from 'src/api/types/request-types'

import { removeExtraFirstSlash } from '../utils'

export const getFileAPIRequestFromMedia = (media: Media, updatedFolderPath?: string): UpdatedFileAPIRequest => {
  const updatedFilePath: Media['filePath'] = updatedFolderPath
    ? `/${removeExtraFirstSlash(updatedFolderPath)}/${media.originalName}`
    : media.filePath

  return {
    id: media.id,
    updatedFields: {
      changeDate: media.changeDate || undefined,
      description: media.description || undefined,
      filePath: updatedFilePath || undefined,
      keywords: media.keywords?.length ? media.keywords : undefined,
      originalDate: media.originalDate,
      originalName: media.originalName,
      rating: media.rating || undefined,
      timeStamp: media.timeStamp,
    },
  }
}

export const getFileAPIRequestFromMediaList = (mediaList: Media[], updatedFolderPath?: string): UpdatedFileAPIRequest[] => (
  mediaList.map((media: Media) => getFileAPIRequestFromMedia(media, updatedFolderPath))
)
