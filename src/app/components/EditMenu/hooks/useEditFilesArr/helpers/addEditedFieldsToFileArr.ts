import { isEmpty, omit } from 'ramda'

import type { Media } from 'src/api/models/media'
import { addKeywordsToAllFiles } from 'src/app/common/utils'

export const addEditedFieldsToFileArr = (
  filesArr: Media[],
  editedFields: Partial<Media>,
): Media[] => {
  const keywords: string[] = editedFields?.keywords || []
  const updatedFileArr = isEmpty(keywords) ? filesArr : addKeywordsToAllFiles(keywords, filesArr)
  return updatedFileArr.map(item => ({ ...item, ...omit(['keywords'], editedFields) }))
}
