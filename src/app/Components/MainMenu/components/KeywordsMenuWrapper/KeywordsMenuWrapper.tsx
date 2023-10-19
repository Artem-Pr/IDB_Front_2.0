import React, { useState } from 'react'
import cn from 'classnames'

import { Empty, Spin } from 'antd'

import KeywordsMenu from '../../../KeywordsMenu'

import styles from '../../index.module.scss'
import { useCurrentPage } from '../../../../common/hooks'
import { useRemoveKeyword, useUniqKeywords } from '../../../../common/hooks/hooks'

export const KeywordsMenuWrapper = () => {
  const [isKeywordsMenuLoading] = useState(false)
  const { isUploadingPage } = useCurrentPage()
  const { removeKeyword } = useRemoveKeyword()
  const { uniqKeywords } = useUniqKeywords()

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
