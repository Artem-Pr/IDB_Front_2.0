import { includes, map, pipe, prop, sum } from 'ramda'

import { FieldsObj } from '../../../../../redux/types'
import { filterIndexed } from '../../../utils'

export const getFileSizesSum = (filesArr: FieldsObj[], selectedList: number[]) =>
  pipe(
    filterIndexed((__: any, idx: number) => includes(idx, selectedList)),
    map(prop('size')),
    sum
  )(filesArr)
