import type { GallerySortingItem, UploadingObject } from 'src/redux/types'
import { Sort } from 'src/redux/types'

export const customSortingComparator = (defaultGallerySortingList: GallerySortingItem[]) => (
  (a: UploadingObject, b: UploadingObject): number => {
    const compare = (sortField: GallerySortingItem): number | null => {
      const fieldId = sortField.id
      if (sortField.sort === null) {
        // Skip sorting if sort is null
        return null
      }
      const sortOrder = sortField.sort === Sort.ASC ? 1 : sortField.sort // sort can be -1 or 1
      const aValue = (a as any)[fieldId]
      const bValue = (b as any)[fieldId]

      // Check if both values are numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * sortOrder
      }

      // If one or both values are strings, compare as strings
      const aStr = String(aValue)
      const bStr = String(bValue)
      return aStr.localeCompare(bStr) * sortOrder
    }

    const result = defaultGallerySortingList.map(compare)
      .find(value => value !== null && value !== 0)

    return result || 0
  })
