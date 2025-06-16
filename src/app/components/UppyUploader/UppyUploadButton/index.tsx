import React, { useEffect, useState } from 'react'

import FileInput from '@uppy/file-input'
import { v4 as uuidV4 } from 'uuid'

import { useUppyUploader } from '../hooks/useUppyUploader'

import styles from './index.module.scss'

export const UppyUploadButton = () => {
  const { uppyInstance } = useUppyUploader()
  const [fileInputPluginId] = useState<string>(uuidV4())

  useEffect(() => {
    const fileInputPlugin = uppyInstance?.getPlugin(fileInputPluginId)
    fileInputPlugin?.uninstall()
    uppyInstance?.use(FileInput, {
      id: fileInputPluginId,
      replaceTargetContent: true,
      target: `.${styles.uppyUploadBtn}`,
    })
  }, [fileInputPluginId, uppyInstance])

  if (!uppyInstance) {
    return null
  }

  return (
    <div className={styles.uppyUploadBtn} />
  )
}
