import React, { memo, useState } from 'react'
import { Button, Modal, Tag } from 'antd'

import { useDispatch, useSelector } from 'react-redux'

import { settings } from '../../../../redux/selectors'
import { deleteUnusedKeyword, fetchUnusedKeywordsList } from '../../../../redux/reducers/settingsSlice-reducer'
import { deleteConfirmation } from '../../../../assets/config/moduleConfig'

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
    dispatch(fetchUnusedKeywordsList()).then(() => {
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
