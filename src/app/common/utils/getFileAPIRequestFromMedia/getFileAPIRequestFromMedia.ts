import type { NullableMedia } from 'src/api/models/media'
import type { UpdatedFileAPIRequest } from 'src/api/types/request-types'

import { removeExtraFirstSlash } from '../utils'

export const getFileAPIRequestFromMedia = (media: NullableMedia, updatedFolderPath?: string): UpdatedFileAPIRequest => {
  const updatedFilePath: NullableMedia['filePath'] = updatedFolderPath && media.originalName
    ? `/${removeExtraFirstSlash(updatedFolderPath)}/${media.originalName}`
    : media.filePath

  return {
    id: media.id,
    updatedFields: {
      changeDate: media.changeDate || undefined,
      description: media.description ?? undefined,
      filePath: updatedFilePath || media.filePath || undefined,
      keywords: media.keywords || undefined,
      originalDate: media.originalDate || undefined,
      originalName: media.originalName || undefined,
      rating: media.rating ?? undefined,
      timeStamp: media.timeStamp || undefined,
    },
  }
}

export const getFileAPIRequestFromMediaList = (
  mediaList: NullableMedia[],
  updatedFolderPath?: string,
): UpdatedFileAPIRequest[] => (
  mediaList.map(media => getFileAPIRequestFromMedia(media, updatedFolderPath))
)
