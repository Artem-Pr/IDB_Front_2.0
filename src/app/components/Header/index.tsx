import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import {
  Layout, Menu, Modal, Typography,
} from 'antd'

import { mainApi } from 'src/api/api'
import { errorMessage } from 'src/app/common/notifications'
import { checkFolderConfirmation, deleteMessageConst } from 'src/assets/config/moduleConfig'
import HeaderBackgroundImage from 'src/assets/svg-icons-html/header-image.svg'
import { PagePaths } from 'src/common/constants'
import {
  folderReducerSetNumberOfFilesInDirectory,
  folderReducerSetNumberOfSubdirectories,
  folderReducerSetShowInfoModal,
} from 'src/redux/reducers/foldersSlice'
import {
  getFolderReducerFolderInfoNumberOfFiles,
  getFolderReducerFolderInfoNumberOfSubdirs,
  getFolderReducerFolderInfoShowInfoModal,
  getFolderReducerFolderPathsArr,
} from 'src/redux/reducers/foldersSlice/selectors'
import { fetchPathsList, removeDirectory } from 'src/redux/reducers/foldersSlice/thunks'
import { useAppDispatch } from 'src/redux/store/store'

import { PageMenuItems } from './PageMenuItems'

import styles from './index.module.scss'

function getRandomBackgroundPosition() {
  return Math.floor(Math.random() * 50)
}

const { Header: HeaderLayout } = Layout
const { Title } = Typography
const menuStyle = { width: 400 }
const imageStyle = { top: `-${getRandomBackgroundPosition()}%` }

const Header = () => {
  const { pathname } = useLocation() as { pathname: PagePaths }
  const dispatch = useAppDispatch()
  const [modal, contextHolder] = Modal.useModal()
  const directoriesArr = useSelector(getFolderReducerFolderPathsArr)
  const showInfoModal = useSelector(getFolderReducerFolderInfoShowInfoModal)
  const numberOfFiles = useSelector(getFolderReducerFolderInfoNumberOfFiles)
  const numberOfSubdirectories = useSelector(getFolderReducerFolderInfoNumberOfSubdirs)

  const defaultKeys = useMemo(() => [pathname], [pathname])

  const content = useMemo(
    () => (
      <div>
        <span>{`files: ${numberOfFiles}`}</span>
        <p>{`subdirectories: ${numberOfSubdirectories}`}</p>
        <p>{deleteMessageConst.directory}</p>
      </div>
    ),
    [numberOfFiles, numberOfSubdirectories],
  )

  useEffect(() => {
    mainApi
      .cleanTemp()
      .catch(err => {
        console.error(err)
        errorMessage(err, 'cleaning temp error', 0)
      })
  }, [])

  useEffect(() => {
    !directoriesArr.length && dispatch(fetchPathsList())
  }, [dispatch, directoriesArr])

  useEffect(() => {
    const cleanModalInfo = () => {
      dispatch(folderReducerSetNumberOfFilesInDirectory(0))
      dispatch(folderReducerSetNumberOfSubdirectories(0))
    }
    const onOk = () => {
      dispatch(removeDirectory())
    }
    const onCancel = () => cleanModalInfo()
    const showModal = () => {
      modal.confirm(checkFolderConfirmation({ onOk, onCancel, content }))
      dispatch(folderReducerSetShowInfoModal(false))
    }

    showInfoModal && showModal()
  }, [content, dispatch, modal, numberOfFiles, numberOfSubdirectories, showInfoModal])

  return (
    <HeaderLayout className="d-flex justify-content-between align-items-center">
      <img
        alt="header-background"
        style={imageStyle}
        className={styles.backgroundImage}
        src={HeaderBackgroundImage}
      />
      <Title className={styles.title}>IDBase</Title>
      <Menu
        style={menuStyle}
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={defaultKeys}
        items={PageMenuItems}
      />
      {contextHolder}
    </HeaderLayout>
  )
}

export default Header
