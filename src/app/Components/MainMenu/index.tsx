import { Empty, Layout, Menu, Spin } from 'antd'
import React, { useState } from 'react'
import { UserOutlined, EditFilled, CreditCardFilled, ProfileOutlined } from '@ant-design/icons'
import cn from 'classnames'

import styles from './index.module.scss'
import { EditMenu, Folders } from '../index'
import { UploadingObject } from '../../../redux/types'
import KeywordsMenu from '../KeywordsMenu'

const { Sider } = Layout
const { SubMenu } = Menu

interface Props {
  uploadingFiles: UploadingObject[]
  selectedList: number[]
  openKeys: string[]
  loading: boolean
  uniqKeywords: string[]
  updateOpenMenus: (value: string[]) => void
  clearSelectedList: () => void
  selectAll: () => void
  updateKeywords: () => Promise<any>
}

const MainMenu = ({
  uploadingFiles,
  selectedList,
  openKeys,
  updateOpenMenus,
  updateKeywords,
  clearSelectedList,
  selectAll,
  loading,
  uniqKeywords,
}: Props) => {
  const [isKeywordsMenuLoading, setIsKeywordsMenuLoading] = useState(true)
  const loadKeywords = () => {
    setIsKeywordsMenuLoading(true)
    updateKeywords().then(() => setIsKeywordsMenuLoading(false))
  }

  const handleTitleClick = ({ key }: { key: string }) => {
    clearSelectedList()
    const openKeysSet = new Set(openKeys)
    key === 'edit' && openKeysSet.delete('template')
    key === 'template' && openKeysSet.delete('edit')
    key === 'keywords' && loadKeywords()
    openKeysSet.has(key) ? openKeysSet.delete(key) : openKeysSet.add(key)
    updateOpenMenus(Array.from(openKeysSet))
  }

  return (
    <Sider theme="light" className={styles.sider} width="300">
      <Menu mode="inline" className={styles.menu} defaultOpenKeys={openKeys} openKeys={openKeys}>
        <SubMenu key="folders" icon={<UserOutlined />} title="Folders" onTitleClick={handleTitleClick}>
          <Folders />
        </SubMenu>
        <SubMenu key="edit" icon={<EditFilled />} title="Edit" onTitleClick={handleTitleClick}>
          <EditMenu {...{ uploadingFiles, selectedList, loading }} />
        </SubMenu>
        <SubMenu key="template" icon={<CreditCardFilled />} title="Template" onTitleClick={handleTitleClick}>
          <EditMenu
            {...{
              uploadingFiles,
              selectedList,
              selectAll,
              loading,
              clearAll: clearSelectedList,
              isEditMany: true,
            }}
          />
        </SubMenu>
        <SubMenu key="keywords" icon={<ProfileOutlined />} title="Keywords" onTitleClick={handleTitleClick}>
          <div className={cn(styles.keywordsMenuWrapper, 'd-flex justify-content-center')}>
            {isKeywordsMenuLoading ? <Spin tip="Loading..." /> : <KeywordsMenu keywords={uniqKeywords} />}
            {!isKeywordsMenuLoading && !uniqKeywords.length ? <Empty /> : ''}
          </div>
        </SubMenu>
      </Menu>
    </Sider>
  )
}

export default MainMenu
