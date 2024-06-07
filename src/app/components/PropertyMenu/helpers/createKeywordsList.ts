import { identity, sortBy } from 'ramda'

import { Keywords } from 'src/redux/types'

export const createKeywordsList = (keywords: Keywords) => sortBy(identity, keywords || [])
