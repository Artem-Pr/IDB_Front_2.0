import { Sort, SortedFields } from '../../../types'

export const defaultGallerySortingList = [
  {
    id: SortedFields.MIMETYPE,
    label: 'File type',
    sort: Sort.ASC,
  },
  {
    id: SortedFields.ORIGINAL_DATE,
    label: 'Original date',
    sort: Sort.DESC,
  },
  {
    id: SortedFields.FILE_PATH,
    label: 'File path',
    sort: Sort.ASC,
  },
  {
    id: SortedFields.ID,
    label: 'Last added',
    sort: null,
  },
  {
    id: SortedFields.MEGAPIXELS,
    label: 'Megapixels',
    sort: null,
  },
  {
    id: SortedFields.ORIGINAL_NAME,
    label: 'Name',
    sort: null,
  },
  {
    id: SortedFields.SIZE,
    label: 'Size',
    sort: null,
  },
  {
    id: SortedFields.RATING,
    label: 'Rating',
    sort: null,
  },
  {
    id: SortedFields.DESCRIPTION,
    label: 'Description',
    sort: null,
  },
]
