import { Layout, Menu } from 'antd'
import React from 'react'
import { UserOutlined, EditFilled, CreditCardFilled } from '@ant-design/icons'

import style from './index.module.scss'
import { EditMenu, Folders } from '../index'

const { Sider } = Layout
const { SubMenu } = Menu

interface Props {
  openKeys: string[]
  updateOpenMenus: (value: string[]) => void
}

const MainMenu = ({ openKeys, updateOpenMenus }: Props) => {
  const handleTitleClick = ({ key }: { key: string }) => {
    const openKeysSet = new Set(openKeys)
    key === 'edit' && openKeysSet.delete('template')
    key === 'template' && openKeysSet.delete('edit')
    openKeysSet.has(key) ? openKeysSet.delete(key) : openKeysSet.add(key)
    updateOpenMenus(Array.from(openKeysSet))
  }

  return (
    <Sider theme="light" className={style.sider} width="300">
      <Menu mode="inline" className={style.menu} defaultOpenKeys={openKeys} openKeys={openKeys}>
        <SubMenu key="folders" icon={<UserOutlined />} title="Folders" onTitleClick={handleTitleClick}>
          <Folders />
        </SubMenu>
        <SubMenu key="edit" icon={<EditFilled />} title="Edit" onTitleClick={handleTitleClick}>
          <EditMenu />
        </SubMenu>
        <SubMenu key="template" icon={<CreditCardFilled />} title="Template" onTitleClick={handleTitleClick}>
          <EditMenu />
        </SubMenu>
      </Menu>
    </Sider>
  )
}

export default MainMenu
