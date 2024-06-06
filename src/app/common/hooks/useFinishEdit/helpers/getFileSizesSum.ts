import {
  includes, map, pipe, prop, sum,
} from 'ramda'

import type { Media } from 'src/api/models/media'
import { filterIndexed } from 'src/app/common/utils'

export const getFileSizesSum = (filesArr: Media[], selectedList: number[]) => pipe<any, any, any, any>(
  filterIndexed((__: any, idx: number) => includes(idx, selectedList)),
  map(prop('size') as any),
  sum,
)(filesArr)
