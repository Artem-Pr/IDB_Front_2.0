import React from 'react'
import { useSelector } from 'react-redux'

import { getCurrentFilesArr, getCurrentSelectedList } from 'src/redux/selectors'

import { PropertyFields } from './components'

import styles from './PropertyMenu.module.scss'

export const PropertyMenu = () => {
  const filesArr = useSelector(getCurrentFilesArr)
  const selectedList = useSelector(getCurrentSelectedList)

  return (
    <div className={styles.wrapper}>
      <PropertyFields filesArr={filesArr} selectedList={selectedList} />
    </div>
  )
}
