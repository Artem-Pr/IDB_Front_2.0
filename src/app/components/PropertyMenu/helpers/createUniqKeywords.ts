import { getUniqArr } from 'src/app/common/utils'
import type { Keywords } from 'src/redux/types'

import { createKeywordsList } from './createKeywordsList'

export const createUniqKeywords = (
  keywordsList1: Keywords | undefined,
  keywordsList2: Keywords | undefined,
) => (
  createKeywordsList(getUniqArr([keywordsList1 || [], keywordsList2 || []]))
)
