import { Sort, SortedFields } from '../../../types'

export const defaultGallerySortingList = [
  {
    id: SortedFields.NAME,
    label: 'Name',
    sort: Sort.DESC,
  },
  {
    id: SortedFields.TYPE,
    label: 'File type',
    sort: null,
  },
  {
    id: SortedFields.ORIGINAL_DATE,
    label: 'Original date',
    sort: null,
  },
  {
    id: SortedFields.MEGAPIXELS,
    label: 'Megapixels',
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
