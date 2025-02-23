import type { RcFile, UploadFile } from 'antd/es/upload'

export const isFileNameAlreadyExist = (file: RcFile | UploadFile, uploadingFilesList: Record<string, string>) => (
  Object.keys(uploadingFilesList)
    .includes(file.name)
)
