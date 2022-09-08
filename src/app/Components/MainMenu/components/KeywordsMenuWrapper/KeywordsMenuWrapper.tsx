import React, { useState } from 'react'
import cn from 'classnames'

import { Empty, Spin } from 'antd'

import KeywordsMenu from '../../../KeywordsMenu'

import styles from '../../index.module.scss'

interface Props {
  isUploadingPage: boolean
  removeKeyword: (keyword: string) => void
  uniqKeywords: string[]
}

export const KeywordsMenuWrapper = ({ isUploadingPage, uniqKeywords, removeKeyword }: Props) => {
  const [isKeywordsMenuLoading] = useState(false)

  return (
    <div className={cn(styles.keywordsMenuWrapper, 'd-flex justify-content-center')}>
      {isKeywordsMenuLoading ? (
        <Spin tip="Loading..." />
      ) : (
        <KeywordsMenu keywords={uniqKeywords} removeKeyword={removeKeyword} isUploadingPage={isUploadingPage} />
      )}
      {!isKeywordsMenuLoading && !uniqKeywords.length ? <Empty /> : ''}
    </div>
  )
}
