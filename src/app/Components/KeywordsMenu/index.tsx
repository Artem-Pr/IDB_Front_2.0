import React from 'react'
import { Tag } from 'antd'
import { identity, sortBy } from 'ramda'

interface Props {
  keywords: string[]
  removeKeyword: (keyword: string) => void
  isUploadingPage: boolean
}

const KeywordsMenu = ({ keywords, removeKeyword, isUploadingPage }: Props) => {
  const handleClose = (keyword: string) => {
    removeKeyword(keyword)
  }

  return (
    <div>
      {sortBy(identity, keywords).map(item => (
        <Tag key={item} closable={isUploadingPage} onClose={() => handleClose(item)}>
          {item}
        </Tag>
      ))}
    </div>
  )
}

export default KeywordsMenu
