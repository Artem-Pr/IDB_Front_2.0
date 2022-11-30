import { GallerySortingItem, Sort, SortedFields } from '../../redux/types'

export const prepareSortingList = (sortingList: GallerySortingItem[]) =>
  sortingList.reduce<Partial<Record<SortedFields, Sort>>>((accum, { sort, id }) => {
    return {
      ...accum,
      ...(sort !== null && { [id]: sort }),
    }
  }, {})
