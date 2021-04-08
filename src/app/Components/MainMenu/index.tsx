import { Layout, Menu } from 'antd'
import React from 'react'
import { UserOutlined } from '@ant-design/icons'

import style from './index.module.scss'
import { Folder } from '../index'

const { Sider } = Layout
const { SubMenu } = Menu

const MainMenu = () => {
  return (
    <Sider theme="light" className={style.sider} width="300">
      <Menu mode="inline" className={style.menu} defaultOpenKeys={['sub1']}>
        <SubMenu key="sub1" icon={<UserOutlined />} title="Folders">
          <Menu.Item key="1" style={{ height: 'auto' }}>
            <Folder />
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  )
}

export default MainMenu
