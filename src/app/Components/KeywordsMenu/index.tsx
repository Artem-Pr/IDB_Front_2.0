import React from 'react'
import { Tag } from 'antd'
import { identity, sortBy } from 'ramda'

interface Props {
  keywords: string[]
  removeKeyword: (keyword: string) => void
}

const KeywordsMenu = ({ keywords, removeKeyword }: Props) => {
  const handleClose = (keyword: string) => {
    removeKeyword(keyword)
  }

  return (
    <div>
      {sortBy(identity, keywords).map(item => (
        <Tag key={item} closable onClose={() => handleClose(item)}>
          {item}
        </Tag>
      ))}
    </div>
  )
}

export default KeywordsMenu
