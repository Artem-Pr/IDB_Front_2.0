import type { Sort } from 'src/common/constants'
import type { GallerySortingItem, SortingFields } from 'src/redux/types'

export const prepareSortingList = (sortingList: GallerySortingItem[]) => (
  sortingList.reduce<Partial<Record<SortingFields, Sort>>>((accum, { sort, id }) => ({
    ...accum,
    ...(sort !== null && { [id]: sort }),
  }), {})
)
