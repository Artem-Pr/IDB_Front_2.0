import { Layout, Menu } from 'antd'
import React from 'react'
import { UserOutlined, EditFilled } from '@ant-design/icons'

import style from './index.module.scss'
import { Folders } from '../index'
import EditMenu from '../EditMenu'

const { Sider } = Layout
const { SubMenu } = Menu

const MainMenu = () => {
  return (
    <Sider theme="light" className={style.sider} width="300">
      <Menu mode="inline" className={style.menu} defaultOpenKeys={['sub1']}>
        <SubMenu key="sub1" icon={<UserOutlined />} title="Folders">
          <Folders />
        </SubMenu>
        <SubMenu key="sub2" icon={<EditFilled />} title="Edit">
          <EditMenu />
        </SubMenu>
      </Menu>
    </Sider>
  )
}

export default MainMenu
