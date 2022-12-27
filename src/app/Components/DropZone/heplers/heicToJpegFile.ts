import { RcFile } from 'antd/es/upload'
import heic2any from 'heic2any'

import { MimeTypes } from '../../../../redux/types/MimeTypes'
import { changeExtension } from '../../../common/utils/utils'

export const heicToJpegFile = async (file: RcFile) => {
  const blob = await heic2any({
    blob: file,
    toType: MimeTypes.jpeg,
    quality: 0.9,
  })

  return new File(Array.isArray(blob) ? blob : [blob], changeExtension(file.name, 'jpg'), {
    lastModified: file.lastModified,
    type: MimeTypes.jpeg,
  })
}
