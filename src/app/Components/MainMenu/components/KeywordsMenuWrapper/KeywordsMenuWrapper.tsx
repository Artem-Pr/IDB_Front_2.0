import React, { useState } from 'react'
import cn from 'classnames'

import { Empty, Spin } from 'antd'

import KeywordsMenu from '../../../KeywordsMenu'

import styles from '../../index.module.scss'
import { useCurrentPage } from '../../../../common/hooks'

interface Props {
  removeKeyword: (keyword: string) => void
  uniqKeywords: string[]
}

export const KeywordsMenuWrapper = ({ uniqKeywords, removeKeyword }: Props) => {
  const [isKeywordsMenuLoading] = useState(false)
  const { isUploadingPage } = useCurrentPage()

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
