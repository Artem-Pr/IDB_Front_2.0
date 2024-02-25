import { identity, sortBy } from 'ramda'

import { Keywords } from '../../../../redux/types'

export const createKeywordsList = (keywords: Keywords) => sortBy(identity, keywords || [])
