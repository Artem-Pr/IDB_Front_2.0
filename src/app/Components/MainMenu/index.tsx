import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Iframe from 'react-iframe'
import { Button, Empty, Layout, Menu, Spin } from 'antd'
import {
  UserOutlined,
  EditFilled,
  CreditCardFilled,
  ProfileOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  PictureOutlined,
} from '@ant-design/icons'

import cn from 'classnames'

import styles from './index.module.scss'
import { EditMenu, Folders, SearchMenu } from '../index'
import { FieldsObj } from '../../../redux/types'
import KeywordsMenu from '../KeywordsMenu'
import PropertyMenu from '../PropertyMenu'
import { folderElement, imagePreview } from '../../../redux/selectors'
import { fetchKeywordsList } from '../../../redux/reducers/foldersSlice-reducer'
import { uploadFiles } from '../../../redux/reducers/uploadSlice-reducer'
import { useCurrentPage } from '../../common/hooks'

const { Sider } = Layout
const { SubMenu } = Menu

interface Props {
  filesArr: FieldsObj[]
  selectedList: number[]
  openKeys: string[]
  isExifLoading: boolean
  uniqKeywords: string[]
  sameKeywords: string[]
  currentFolderPath: string
  updateOpenMenus: (value: string[]) => void
  clearSelectedList: () => void
  selectAll: () => void
  removeKeyword: (keyword: string) => void
  removeFiles: () => void
  isComparisonPage?: boolean
}

const MainMenu = ({
  filesArr,
  selectedList,
  openKeys,
  updateOpenMenus,
  removeKeyword,
  currentFolderPath,
  isComparisonPage,
  clearSelectedList,
  selectAll,
  isExifLoading,
  uniqKeywords,
  sameKeywords,
  removeFiles,
}: Props) => {
  const dispatch = useDispatch()
  const { keywordsList: allKeywords } = useSelector(folderElement)
  const { previewType, originalPath, originalName } = useSelector(imagePreview)
  const [isKeywordsMenuLoading] = useState(false)
  const { isUploadingPage, isMainPage } = useCurrentPage()

  useEffect(() => {
    !allKeywords.length && dispatch(fetchKeywordsList())
  }, [allKeywords.length, dispatch])

  const handleTitleClick = ({ key }: { key: string }) => {
    clearSelectedList()
    const openKeysSet = new Set(openKeys)
    key === 'edit' && openKeysSet.delete('template')
    key === 'template' && openKeysSet.delete('edit')
    openKeysSet.has(key) ? openKeysSet.delete(key) : openKeysSet.add(key)
    updateOpenMenus(Array.from(openKeysSet))
  }

  const handleUploadClick = () => {
    dispatch(uploadFiles(filesArr, currentFolderPath))
    removeFiles()
    updateOpenMenus(['folders'])
  }

  const KeywordsMenuWrapper = () => (
    <div className={cn(styles.keywordsMenuWrapper, 'd-flex justify-content-center')}>
      {isKeywordsMenuLoading ? (
        <Spin tip="Loading..." />
      ) : (
        <KeywordsMenu keywords={uniqKeywords} removeKeyword={removeKeyword} isUploadingPage={isUploadingPage} />
      )}
      {!isKeywordsMenuLoading && !uniqKeywords.length ? <Empty /> : ''}
    </div>
  )

  return (
    <Sider theme="light" className={styles.sider} width="400">
      <Menu mode="inline" className={styles.menu} defaultOpenKeys={openKeys} openKeys={openKeys}>
        <SubMenu key="search" icon={<SearchOutlined />} title="Search" onTitleClick={handleTitleClick}>
          <SearchMenu />
        </SubMenu>
        {!isComparisonPage && (
          <SubMenu key="folders" icon={<UserOutlined />} title="Folders" onTitleClick={handleTitleClick}>
            <Folders isMainPage={isMainPage} />
          </SubMenu>
        )}
        <SubMenu key="properties" icon={<InfoCircleOutlined />} title="Properties" onTitleClick={handleTitleClick}>
          <PropertyMenu filesArr={filesArr} selectedList={selectedList} isUploadingPage={isUploadingPage} />
        </SubMenu>
        <SubMenu key="edit" icon={<EditFilled />} title="Edit" onTitleClick={handleTitleClick}>
          <EditMenu
            {...{
              filesArr,
              selectedList,
              sameKeywords,
              isExifLoading,
              allKeywords,
              isMainPage,
            }}
          />
        </SubMenu>
        <SubMenu key="template" icon={<CreditCardFilled />} title="Template" onTitleClick={handleTitleClick}>
          <EditMenu
            {...{
              filesArr,
              selectedList,
              sameKeywords,
              selectAll,
              isExifLoading,
              allKeywords,
              clearAll: clearSelectedList,
              isEditMany: true,
              isMainPage,
            }}
          />
        </SubMenu>
        <SubMenu key="keywords" icon={<ProfileOutlined />} title="Keywords" onTitleClick={handleTitleClick}>
          <KeywordsMenuWrapper />
        </SubMenu>
        <SubMenu
          key="preview"
          className={cn(styles.previewMenu, 'position-relative')}
          icon={<PictureOutlined />}
          title="Preview"
          onTitleClick={handleTitleClick}
          disabled={!originalPath}
        >
          <Menu.Item key="image-preview" className={cn(styles.preview)}>
            {previewType === 'video' ? (
              <Iframe
                url={originalPath || ''}
                width="80vm"
                id="myId"
                className={styles.previewImg}
                position="relative"
                allowFullScreen
              />
            ) : (
              <img className={styles.previewImg} src={originalPath} alt={originalName} />
            )}
            <h3>{originalName}</h3>
          </Menu.Item>
        </SubMenu>
        {isUploadingPage ? (
          <Menu.Item key="buttons-menu">
            <div className="d-flex justify-content-around">
              <Button disabled={!filesArr.length} type="primary" onClick={removeFiles} danger>
                Delete all files
              </Button>
              <Button disabled={!currentFolderPath || !filesArr.length} type="primary" onClick={handleUploadClick}>
                Upload files
              </Button>
            </div>
          </Menu.Item>
        ) : (
          ''
        )}
      </Menu>
    </Sider>
  )
}

export default MainMenu
