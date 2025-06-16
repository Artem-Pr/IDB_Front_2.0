import React, { useMemo } from 'react'

import { UserOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'

import { useIsAuthenticated } from 'src/app/common/hooks/useIsAuthenticated'
import { logout } from 'src/redux/reducers/sessionSlice/thunks'
import { useAppDispatch } from 'src/redux/store/store'

import styles from './UserDropdownMenu.module.scss'

export const UserDropdownMenu = () => {
  const dispatch = useAppDispatch()
  const isAuth = useIsAuthenticated()

  const menu: MenuProps = useMemo(() => {
    const handleLogout = () => {
      dispatch(logout())
    }

    return {

      items: [{
        key: '1',
        label: <span onClick={handleLogout}>Logout</span>,
      }]
    }
  }, [dispatch])

  return (
    isAuth
      ? (
        <Dropdown menu={menu} trigger={['click']}>
          <UserOutlined className={styles.userDropdownMenuContainer} />
        </Dropdown>
      )
      : <UserOutlined className={styles.userDropdownMenuContainer} />
  )
}
