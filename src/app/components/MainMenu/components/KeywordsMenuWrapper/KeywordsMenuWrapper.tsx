import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { Empty, Spin } from 'antd'
import cn from 'classnames'

import { useRemoveKeyword } from 'src/app/common/hooks'
import KeywordsMenu from 'src/app/components/KeywordsMenu'
import { getSessionReducerIsCurrentPage } from 'src/redux/reducers/sessionSlice/selectors'
import { getUniqKeywords } from 'src/redux/selectors'

import styles from '../../index.module.scss'

export const KeywordsMenuWrapper = () => {
  const { isUploadPage } = useSelector(getSessionReducerIsCurrentPage)
  const uniqKeywordsList = useSelector(getUniqKeywords)
  const [isKeywordsMenuLoading] = useState(false)
  const { removeKeyword } = useRemoveKeyword()

  return (
    <div className={cn(styles.keywordsMenuWrapper, 'd-flex justify-content-center')}>
      {isKeywordsMenuLoading
        ? (
          <Spin tip="Loading..." />
        )
        : (
          <KeywordsMenu keywords={uniqKeywordsList} removeKeyword={removeKeyword} isUploadingPage={isUploadPage} />
        )}
      {!isKeywordsMenuLoading && !uniqKeywordsList.length ? <Empty /> : ''}
    </div>
  )
}
