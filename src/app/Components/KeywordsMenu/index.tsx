import React from 'react'
import { Tag } from 'antd'

interface Props {
  keywords: string[]
}

const KeywordsMenu = ({ keywords }: Props) => {
  const handleClose = (keyword: string) => {
    console.log(keyword)
  }

  return (
    <div>
      {keywords.map(item => (
        <Tag key={item} closable onClose={() => handleClose(item)}>
          {item}
        </Tag>
      ))}
    </div>
  )
}

export default KeywordsMenu
