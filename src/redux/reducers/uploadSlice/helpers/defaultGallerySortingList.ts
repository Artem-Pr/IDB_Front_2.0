import type { GallerySortingItem } from '../../../types'
import { Sort } from '../../../types'

export const defaultGallerySortingList: GallerySortingItem[] = [
  {
    id: 'originalName',
    label: 'Name',
    sort: Sort.DESC,
  },
  {
    id: 'mimetype',
    label: 'File type',
    sort: null,
  },
  {
    id: 'originalDate',
    label: 'Original date',
    sort: null,
  },
  {
    id: 'megapixels',
    label: 'Megapixels',
    sort: null,
  },
  {
    id: 'size',
    label: 'Size',
    sort: null,
  },
  {
    id: 'rating',
    label: 'Rating',
    sort: null,
  },
  {
    id: 'description',
    label: 'Description',
    sort: null,
  },
]
