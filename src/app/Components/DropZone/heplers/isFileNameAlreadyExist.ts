import { RcFile } from 'antd/es/upload'

export const isFileNameAlreadyExist = (file: RcFile, uploadingFilesList: Record<string, string>) => {
  return Object.keys(uploadingFilesList).includes(file.name)
}
