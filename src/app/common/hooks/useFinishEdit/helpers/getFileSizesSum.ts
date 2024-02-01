import {
  includes, map, pipe, prop, sum,
} from 'ramda'

import type { FieldsObj } from '../../../../../redux/types'
import { filterIndexed } from '../../../utils'

export const getFileSizesSum = (filesArr: FieldsObj[], selectedList: number[]) => pipe<any, any, any, any>(
  filterIndexed((__: any, idx: number) => includes(idx, selectedList)),
  map(prop('size') as any),
  sum,
)(filesArr)
