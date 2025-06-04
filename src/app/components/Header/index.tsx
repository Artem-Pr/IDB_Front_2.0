import React, {
  CSSProperties, memo, useEffect, useMemo,
} from 'react'
import { useSelector } from 'react-redux'

import {
  Layout, Modal, Typography,
} from 'antd'

import { checkFolderConfirmation, deleteMessageConst } from 'src/assets/config/moduleConfig'
import HeaderBackgroundImage from 'src/assets/svg-icons-html/header-image.svg'
import {
  folderReducerSetNumberOfFilesInDirectory,
  folderReducerSetNumberOfSubdirectories,
  folderReducerSetShowInfoModal,
} from 'src/redux/reducers/foldersSlice'
import {
  getFolderReducerFolderInfoNumberOfFiles,
  getFolderReducerFolderInfoNumberOfSubdirs,
  getFolderReducerFolderInfoShowInfoModal,
} from 'src/redux/reducers/foldersSlice/selectors'
import { removeDirectory } from 'src/redux/reducers/foldersSlice/thunks'
import { getSessionReducerIsCurrentPage } from 'src/redux/reducers/sessionSlice/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { HeaderMenu } from './HeaderMenu'

import styles from './index.module.scss'

function getRandomBackgroundPosition() {
  return Math.floor(Math.random() * 50)
}

const { Header: HeaderLayout } = Layout
const { Title } = Typography
const imageStyle: CSSProperties = { top: `-${getRandomBackgroundPosition()}%` }

export const Header = memo(() => {
  const dispatch = useAppDispatch()
  const { isLoginPage } = useSelector(getSessionReducerIsCurrentPage)
  const [modal, contextHolder] = Modal.useModal()
  const showInfoModal = useSelector(getFolderReducerFolderInfoShowInfoModal)
  const numberOfFiles = useSelector(getFolderReducerFolderInfoNumberOfFiles)
  const numberOfSubdirectories = useSelector(getFolderReducerFolderInfoNumberOfSubdirs)

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
    <HeaderLayout className={styles.header}>
      <div className={styles.backgroundImage}>
        <div className="position-relative h-100 w-100">
          <img
            alt="header-background"
            style={imageStyle}
            src={HeaderBackgroundImage}
          />
        </div>
      </div>
      <Title className={styles.title}>IDBase</Title>
      {!isLoginPage && <HeaderMenu />}
      {contextHolder}
    </HeaderLayout>
  )
})
