import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import {
  Layout, Menu, Modal, Typography,
} from 'antd'

import { mainApi } from 'src/api/api'
import { checkFolderConfirmation, deleteMessageConst } from 'src/assets/config/moduleConfig'
import HeaderBackgroundImage from 'src/assets/svg-icons-html/header-image.svg'
import {
  setNumberOfFilesInDirectory,
  setNumberOfSubdirectories,
  setShowInfoModal,
} from 'src/redux/reducers/foldersSlice/foldersSlice'
import { fetchPathsList, removeDirectory } from 'src/redux/reducers/foldersSlice/thunks'
import {
  folderInfoShowInfoModal, folderInfoNumberOfFiles, pathsArr, folderInfoNumberOfSubdirs,
} from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { useCurrentPage } from '../../common/hooks'

import { PageMenuItems } from './PageMenuItems'

import styles from './index.module.scss'

const { Header: HeaderLayout } = Layout
const { Title } = Typography

function getRandomBackgroundPosition() {
  return Math.floor(Math.random() * 50)
}

const Header = () => {
  const dispatch = useAppDispatch()
  const [modal, contextHolder] = Modal.useModal()
  const directoriesArr = useSelector(pathsArr)
  const showInfoModal = useSelector(folderInfoShowInfoModal)
  const numberOfFiles = useSelector(folderInfoNumberOfFiles)
  const numberOfSubdirectories = useSelector(folderInfoNumberOfSubdirs)
  const { currentPageNumber } = useCurrentPage()

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
    mainApi.cleanTemp()
  }, [])

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
      <img
        alt="header-background"
        style={{ top: `-${getRandomBackgroundPosition()}%` }}
        className={styles.backgroundImage}
        src={HeaderBackgroundImage}
      />
      <Title className={styles.title}>IDBase</Title>
      <Menu
        style={{ width: 400 }}
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[currentPageNumber]}
        items={PageMenuItems}
      />
      {contextHolder}
    </HeaderLayout>
  )
}

export default Header
