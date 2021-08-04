import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Select } from 'antd'
import { difference } from 'ramda'
import cn from 'classnames'

import { folderElement, main } from '../../../redux/selectors'
import styles from './index.module.scss'
import { fetchPhotos, setExcludeTags, setSearchTags } from '../../../redux/reducers/mainPageSlice-reducer'

const { Option } = Select

const SearchMenu = () => {
  const dispatch = useDispatch<any>()
  const { keywordsList } = useSelector(folderElement)
  const { searchTags, excludeTags } = useSelector(main)
  const searchKeywordsList = useMemo(() => difference(keywordsList, excludeTags), [excludeTags, keywordsList])
  const excludeKeywordsList = useMemo(() => difference(keywordsList, searchTags), [searchTags, keywordsList])

  const handleSearchChange = (value: string[]) => {
    dispatch(setSearchTags(value))
    dispatch(fetchPhotos())
  }

  const handleExcludeChange = (value: string[]) => {
    dispatch(setExcludeTags(value))
    dispatch(fetchPhotos())
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Search tags:</span>
      <Select
        className={cn(styles.select, 'w-100')}
        mode="tags"
        placeholder="choose Keywords"
        onChange={handleSearchChange}
      >
        {searchKeywordsList.map(keyword => (
          <Option key={keyword} value={keyword}>
            {keyword}
          </Option>
        ))}
      </Select>
      <span className={styles.title}>Exclude tags:</span>
      <Select className="w-100" mode="tags" placeholder="choose Keywords" onChange={handleExcludeChange}>
        {excludeKeywordsList.map(keyword => (
          <Option key={keyword} value={keyword}>
            {keyword}
          </Option>
        ))}
      </Select>
    </div>
  )
}

export default SearchMenu
