import { Layout, Menu } from 'antd'
import React from 'react'
import { UserOutlined } from '@ant-design/icons'

import { FolderTree } from '../index'
import style from './index.module.scss'

const { Sider } = Layout
const { SubMenu } = Menu

const MainMenu = () => {
  return (
    <Sider theme="light" className={style.sider} width="300">
      <Menu mode="inline" className={style.menu} defaultOpenKeys={['sub1']}>
        <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
          <Menu.Item key="1" style={{ height: 'auto' }}>
            <FolderTree />
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  )
}

export default MainMenu
