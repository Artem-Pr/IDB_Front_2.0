import { compose } from 'ramda'

import { removeExtraFirstSlash, removeExtraSlash } from 'src/app/common/utils'

export const getNewFilePath = (isName: boolean, newName: string, originalName: string, filePath: string) => {
  const preparedFilePath = compose(removeExtraSlash, removeExtraFirstSlash)(filePath)
  return `${preparedFilePath}/${isName ? newName : originalName}`
}
