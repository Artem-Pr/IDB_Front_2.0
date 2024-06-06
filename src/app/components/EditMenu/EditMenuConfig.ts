import type { MediaChangeable } from 'src/api/models/media'
import type { CheckboxType } from 'src/redux/types'

interface MediaFormField<T extends keyof MediaChangeable> {
  checkboxName: CheckboxType
  label: string
  name: T
  placeholder?: string
}

  type MediaFromFields<T extends keyof MediaChangeable> = Record<T, MediaFormField<T>>

export const mediaFields: MediaFromFields<keyof MediaChangeable> = {
  rating: {
    checkboxName: 'isRating',
    label: 'Rating:',
    name: 'rating',
  },
  originalName: {
    checkboxName: 'isName',
    label: 'Name:',
    name: 'originalName',
    placeholder: 'Edit name',
  },
  originalDate: {
    checkboxName: 'isOriginalDate',
    label: 'Original date:',
    name: 'originalDate',
    placeholder: 'Edit date',
  },
  filePath: {
    checkboxName: 'isFilePath',
    label: 'File path:',
    name: 'filePath',
    placeholder: 'Edit file path',
  },
  keywords: {
    checkboxName: 'isKeywords',
    label: 'Keywords:',
    name: 'keywords',
    placeholder: 'Edit keywords',
  },
  description: {
    checkboxName: 'isDescription',
    label: 'Description:',
    name: 'description',
    placeholder: 'maxLength is 2000',
  },
  timeStamp: {
    checkboxName: 'isTimeStamp',
    label: 'Time stamp:',
    name: 'timeStamp',
    placeholder: 'Edit time stamp',
  },
}
