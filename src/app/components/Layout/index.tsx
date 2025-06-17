import React, {
  CSSProperties, useEffect, useMemo,
} from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import {
  Layout as AntLayout, Modal, Spin, Typography,
} from 'antd'
import type { AxiosError } from 'axios'
import { HttpStatusCode } from 'axios'

import { mainApi } from 'src/api/requests/api-requests'
import { useIsAuthenticated } from 'src/app/common/hooks'
import { errorMessage } from 'src/app/common/notifications'
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
  getFolderReducerFolderPathsArr,
} from 'src/redux/reducers/foldersSlice/selectors'
import { fetchPathsList, removeDirectory } from 'src/redux/reducers/foldersSlice/thunks'
import { getSessionReducerIsLoading } from 'src/redux/reducers/sessionSlice/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { HeaderMenu } from './HeaderMenu'
import { UserDropdownMenu } from './components'

import styles from './index.module.scss'

function getRandomBackgroundPosition() {
  return Math.floor(Math.random() * 50)
}

const { Header: HeaderLayout } = AntLayout
const { Title } = Typography
const imageStyle: CSSProperties = { top: `-${getRandomBackgroundPosition()}%` }

export const Layout = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useIsAuthenticated()
  const [modal, contextHolder] = Modal.useModal()
  const loading = useSelector(getSessionReducerIsLoading)
  const directoriesArr = useSelector(getFolderReducerFolderPathsArr)
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

  // TODO: move this logic to hook
  useEffect(() => {
    isAuthenticated && mainApi
      .cleanTemp()
      .catch((err: AxiosError) => {
        console.info("🚀 ~ 'cleaning temp error':", err)
        if (err?.status !== HttpStatusCode.Unauthorized) {
          errorMessage(err, 'cleaning temp error', 0)
        }
      })
  }, [isAuthenticated])

  useEffect(() => {    
    isAuthenticated && !directoriesArr.length && dispatch(fetchPathsList())
  }, [dispatch, directoriesArr, isAuthenticated])

  // TODO: move this logic to hook
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
    <AntLayout>
      <div className="App">
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
          <HeaderMenu />
          <UserDropdownMenu />
          {contextHolder}
        </HeaderLayout>
      </div>
      <Spin
        spinning={loading}
        tip="Loading..."
      >
        <Outlet />
      </Spin>
    </AntLayout>
  )
}
