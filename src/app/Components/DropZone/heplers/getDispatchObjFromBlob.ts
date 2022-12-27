import { RcFile } from 'antd/es/upload'

export const getDispatchObjFromBlob = (file: RcFile) => ({
  name: file.name,
  originalPath: URL.createObjectURL(file),
})
