import { Sort } from 'src/common/constants'
import type { GallerySortingItem } from 'src/redux/types'

export const defaultGallerySortingList: GallerySortingItem[] = [
  {
    id: 'mimetype',
    label: 'File type',
    sort: null,
  },
  {
    id: 'originalDate',
    label: 'Original date',
    sort: Sort.DESC,
  },
  {
    id: 'filePath',
    label: 'File path',
    sort: Sort.ASC,
  },
  {
    id: 'id',
    label: 'Last added',
    sort: null,
  },
  {
    id: 'megapixels',
    label: 'Megapixels',
    sort: null,
  },
  {
    id: 'originalName',
    label: 'Name',
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
