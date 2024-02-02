import type { GallerySortingItem, UploadingObject } from '../../../types'
import { Sort } from '../../../types'

export const customSortingComparator = (defaultGallerySortingList: GallerySortingItem[]) => (
  (a: UploadingObject, b: UploadingObject): number => {
    const compare = (sortField: GallerySortingItem): number => {
      const fieldId = sortField.id
      const sortOrder = sortField.sort === Sort.ASC ? 1 : -1
      const aValue = (a as any)[fieldId]
      const bValue = (b as any)[fieldId]
      return Math.sign(aValue - bValue) * (sortField.sort !== null ? sortOrder : 0)
    }

    const result = defaultGallerySortingList.map(compare)
      .find(value => value !== 0)

    return result || 0
  })
