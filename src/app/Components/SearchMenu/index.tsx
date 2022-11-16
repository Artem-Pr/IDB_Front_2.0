import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Row, Select } from 'antd'
import { difference, keys } from 'ramda'
import cn from 'classnames'

import { folderElement, main, searchMenu } from '../../../redux/selectors'
import styles from './index.module.scss'
import { fetchPhotos, setExcludeTags, setMimeTypes, setSearchTags } from '../../../redux/reducers/mainPageSlice-reducer'
import { MimeTypes } from '../../../redux/types/MimeTypes'

const { Option } = Select
const fileTypes = keys(MimeTypes)

const SearchMenu = () => {
  const dispatch = useDispatch<any>()
  const { keywordsList } = useSelector(folderElement)
  const { searchTags, excludeTags, mimetypes } = useSelector(searchMenu)
  const { isGalleryLoading } = useSelector(main)
  const searchKeywordsList = useMemo(() => difference(keywordsList, excludeTags), [excludeTags, keywordsList])
  const excludeKeywordsList = useMemo(() => difference(keywordsList, searchTags), [searchTags, keywordsList])

  const handleSearchChange = (value: string[]) => {
    dispatch(setSearchTags(value))
  }

  const handleExcludeChange = (value: string[]) => {
    dispatch(setExcludeTags(value))
  }

  const handleFileTypesChange = (value: MimeTypes[]) => {
    dispatch(setMimeTypes(value))
  }

  const fetchGallery = () => {
    dispatch(fetchPhotos())
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Search tags:</span>
      <Select
        className={cn(styles.select, 'w-100')}
        mode="tags"
        placeholder="select Keywords"
        onChange={handleSearchChange}
        value={searchTags}
      >
        {searchKeywordsList.map(keyword => (
          <Option key={keyword} value={keyword}>
            {keyword}
          </Option>
        ))}
      </Select>
      <span className={styles.title}>Exclude tags:</span>
      <Select
        className={cn(styles.select, 'w-100')}
        mode="tags"
        placeholder="select Keywords"
        onChange={handleExcludeChange}
        value={excludeTags}
      >
        {excludeKeywordsList.map(keyword => (
          <Option key={keyword} value={keyword}>
            {keyword}
          </Option>
        ))}
      </Select>
      <span className={styles.title}>Files type:</span>
      <Select
        className={cn(styles.select, 'w-100')}
        mode="tags"
        placeholder="select files type"
        onChange={handleFileTypesChange}
        value={mimetypes}
      >
        {fileTypes.map(type => (
          <Option key={type} value={MimeTypes[type]}>
            {type}
          </Option>
        ))}
      </Select>
      <Row>
        <Col offset={17} span={7}>
          <Button className="w-100" type="primary" loading={isGalleryLoading} onClick={fetchGallery}>
            Search
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default SearchMenu
