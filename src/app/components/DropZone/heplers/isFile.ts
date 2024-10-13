import { RcFile, UploadFile } from 'antd/es/upload'

export const isFile = (file: string | Blob | RcFile | UploadFile): file is (RcFile | UploadFile) => (
  Boolean((file as RcFile)?.name)
)
