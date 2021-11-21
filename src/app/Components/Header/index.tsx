import React, { useEffect, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Layout, Menu, Modal, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { useCurrentPage } from '../../common/hooks/hooks'
import {
  fetchPathsList,
  removeDirectory,
  setNumberOfFilesInDirectory,
  setNumberOfSubdirectories,
  setShowInfoModal,
} from '../../../redux/reducers/foldersSlice-reducer'
import { curFolderInfo, pathsArr } from '../../../redux/selectors'
import { checkFolderConfirmation, deleteMessageConst } from '../../../assets/config/moduleConfig'
import { Pages } from '../../../redux/types'

const { Header: HeaderLayout } = Layout
const { Title } = Typography

const Header = () => {
  const dispatch = useDispatch()
  const [modal, contextHolder] = Modal.useModal()
  const directoriesArr = useSelector(pathsArr)
  const { showInfoModal, numberOfFiles, numberOfSubdirectories } = useSelector(curFolderInfo)
  const { currentPageNumber } = useCurrentPage()

  const content = useMemo(
    () => (
      <div>
        <span>{`files: ${numberOfFiles}`}</span>
        <p>{`subdirectories: ${numberOfSubdirectories}`}</p>
        <p>{deleteMessageConst.directory}</p>
      </div>
    ),
    [numberOfFiles, numberOfSubdirectories]
  )

  useEffect(() => {
    !directoriesArr.length && dispatch(fetchPathsList())
  }, [dispatch, directoriesArr])

  useEffect(() => {
    const cleanModalInfo = () => {
      dispatch(setNumberOfFilesInDirectory(0))
      dispatch(setNumberOfSubdirectories(0))
    }
    const onOk = () => {
      dispatch(removeDirectory())
    }
    const onCancel = () => cleanModalInfo()
    const showModal = () => {
      modal.confirm(checkFolderConfirmation({ onOk, onCancel, content }))
      dispatch(setShowInfoModal(false))
    }

    showInfoModal && showModal()
  }, [content, dispatch, modal, numberOfFiles, numberOfSubdirectories, showInfoModal])

  return (
    <HeaderLayout className="d-flex justify-content-between align-items-center">
      <Title>IDBase</Title>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[currentPageNumber]}>
        <Menu.Item key={Pages.MAIN}>
          <NavLink to="/">Main page</NavLink>
        </Menu.Item>
        <Menu.Item key={Pages.UPLOAD}>
          <NavLink to="/upload">Upload</NavLink>
        </Menu.Item>
        <Menu.Item key={Pages.TEST_DB}>
          <NavLink to="/test-db">Database tests</NavLink>
        </Menu.Item>
      </Menu>
      {contextHolder}
    </HeaderLayout>
  )
}

export default Header
