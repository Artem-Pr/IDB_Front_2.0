import React from 'react'
import { useSelector } from 'react-redux'

import { currentFilesList, currentSelectedList } from 'src/redux/selectors'

import { PropertyFields } from './components'

import styles from './PropertyMenu.module.scss'

export const PropertyMenu = () => {
  const filesArr = useSelector(currentFilesList)
  const selectedList = useSelector(currentSelectedList)

  return (
    <div className={styles.wrapper}>
      <PropertyFields filesArr={filesArr} selectedList={selectedList} />
    </div>
  )
}
