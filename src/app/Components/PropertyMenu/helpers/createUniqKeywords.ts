import { Keywords } from '../../../../redux/types'
import { getUniqArr } from '../../../common/utils'

import { createKeywordsList } from './createKeywordsList'

export const createUniqKeywords = (
  keywordsList1: Keywords | undefined,
  keywordsList2: Keywords | undefined,
) => (
  createKeywordsList(getUniqArr([keywordsList1 || [], keywordsList2 || []]))
)
