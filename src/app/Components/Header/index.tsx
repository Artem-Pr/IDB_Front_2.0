import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Layout, Menu, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { useCurrentPage } from '../../common/hooks/hooks'
import { fetchPathsList } from '../../../redux/reducers/foldersSlice-reducer'
import { pathsArr } from '../../../redux/selectors'

const { Header: HeaderLayout } = Layout
const { Title } = Typography

const Header = () => {
  const dispatch = useDispatch()
  const directoriesArr = useSelector(pathsArr)
  const { currentPageNumber } = useCurrentPage()

  useEffect(() => {
    !directoriesArr.length && dispatch(fetchPathsList())
  }, [dispatch, directoriesArr])

  return (
    <HeaderLayout className="d-flex justify-content-between align-items-center">
      <Title>IDBase</Title>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[currentPageNumber]}>
        <Menu.Item key="1">
          <NavLink to="/">Main page</NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/upload">Upload</NavLink>
        </Menu.Item>
      </Menu>
    </HeaderLayout>
  )
}

export default Header
