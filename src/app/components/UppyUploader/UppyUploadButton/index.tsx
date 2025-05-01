import React, { useContext, useEffect, useState } from 'react'

import FileInput from '@uppy/file-input'
import { v4 as uuidV4 } from 'uuid'

import { UppyInstanceContext } from 'src/common/UppyInstanceContext'

import styles from './index.module.scss'

export const UppyUploadButton = () => {
  const uppy = useContext(UppyInstanceContext)
  const [fileInputPluginId] = useState<string>(uuidV4())

  useEffect(() => {
    const fileInputPlugin = uppy?.getPlugin(fileInputPluginId)
    fileInputPlugin?.uninstall()
    uppy?.use(FileInput, {
      id: fileInputPluginId,
      replaceTargetContent: true,
      target: `.${styles.uppyUploadBtn}`,
    })
  }, [fileInputPluginId, uppy])

  if (!uppy) {
    return null
  }

  return (
    <div className={styles.uppyUploadBtn} />
  )
}
