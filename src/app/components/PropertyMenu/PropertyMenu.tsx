import React from 'react'

import { useFilesList, useSelectedList } from 'src/app/common/hooks'

import { PropertyFields } from './components'

import styles from './PropertyMenu.module.scss'

export const PropertyMenu = () => {
  const { filesArr } = useFilesList()
  const { selectedList } = useSelectedList()

  return (
    <div className={styles.wrapper}>
      <PropertyFields filesArr={filesArr} selectedList={selectedList} />
    </div>
  )
}
