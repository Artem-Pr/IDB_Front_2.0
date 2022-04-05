import { reduce, union } from 'ramda'

export const getUniqArr = (keywordsArrays: string[][]) => reduce<string[], string[]>(union, [], keywordsArrays)
