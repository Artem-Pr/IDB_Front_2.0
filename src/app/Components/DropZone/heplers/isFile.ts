import { RcFile } from 'antd/es/upload'

export const isFile = (file: string | Blob | RcFile): file is RcFile => Boolean((file as RcFile)?.name)
