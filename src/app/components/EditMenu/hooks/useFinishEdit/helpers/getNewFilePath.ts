import { sanitizeDirectory } from 'src/app/common/utils'

export const getNewFilePath = (isName: boolean, newName: string, originalName: string, filePath: string) => (
  `${sanitizeDirectory(filePath)}/${isName ? newName : originalName}`
)
