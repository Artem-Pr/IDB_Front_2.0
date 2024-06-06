import type { Media } from '../models/media'

interface UpdatedFields extends Pick<Media,
'originalName' | 'filePath' | 'originalDate' | 'keywords' | 'rating' | 'description' | 'timeStamp' | 'changeDate'> {}

export interface UpdatedFileAPIRequest {
  id: Media['id']
  updatedFields: Partial<UpdatedFields>
}
