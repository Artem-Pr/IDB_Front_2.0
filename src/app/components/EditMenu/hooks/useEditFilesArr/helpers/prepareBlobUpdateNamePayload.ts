import type { Media } from 'src/api/models/media'
import type { BlobUpdateNamePayload } from 'src/redux/types'

export const prepareBlobUpdateNamePayload = (newFilesArr: Media[]) => (
  ({ originalName, id }: Media): BlobUpdateNamePayload | false => {
    const updatedName = newFilesArr.find(newItem => newItem.id === id)?.originalName

    return updatedName
      ? {
        oldName: originalName,
        newName: updatedName,
      }
      : false
  }
)
