import React, { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Modal, Tag } from 'antd'

import { deleteConfirmation } from 'src/assets/config/moduleConfig'
import { deleteUnusedKeyword, fetchUnusedKeywordsList } from 'src/redux/reducers/settingsSlice/thunks'
import { settings } from 'src/redux/selectors'

export const UnusedKeywords = memo(() => {
  const dispatch = useDispatch<any>()
  const [modal, contextHolder] = Modal.useModal()
  const { unusedKeywords } = useSelector(settings)
  const [isUnusedKeywordsLoaded, setIsUnusedKeywordsLoaded] = useState(false)
  const [unusedKeywordsLoading, setUnusedKeywordsLoading] = useState(false)

  const allKeywordsAreUsed = Boolean(!unusedKeywordsLoading && isUnusedKeywordsLoaded && !unusedKeywords.length)
  const showUnusedKeywordsList = Boolean(!unusedKeywordsLoading && isUnusedKeywordsLoaded && unusedKeywords.length)

  const handleUpdateUnusedKeywordsList = async () => {
    setUnusedKeywordsLoading(true)
    dispatch(fetchUnusedKeywordsList())
      .then(() => {
        setUnusedKeywordsLoading(false)
        setIsUnusedKeywordsLoaded(true)
      })
  }

  const handleRemoveUnusedKeyword = (keyword: string) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const onOk = () => {
      dispatch(deleteUnusedKeyword(keyword))
    }
    modal.confirm(deleteConfirmation({ onOk, type: 'keyword' }))
  }

  return (
    <>
      {allKeywordsAreUsed && <span>All keywords are used</span>}
      {!isUnusedKeywordsLoaded && (
        <Button onClick={handleUpdateUnusedKeywordsList} loading={unusedKeywordsLoading}>
          Click to update
        </Button>
      )}
      <div>
        {showUnusedKeywordsList && (
          <div>
            {unusedKeywords.map(keyword => (
              <Tag style={{ width: 'auto' }} key={keyword} onClose={handleRemoveUnusedKeyword(keyword)} closable>
                {keyword}
              </Tag>
            ))}
          </div>
        )}
      </div>
      {contextHolder}
    </>
  )
})
