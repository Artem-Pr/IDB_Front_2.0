import React, { useEffect } from 'react'
import { Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'ramda'

import { CustomAlert, Gallery, MainMenu } from '../../Components'
import {
  allDownloadingKeywordsSelector,
  dAllSameKeywordsSelector,
  dPageGalleryPropsSelector,
  folderElement,
  main,
} from '../../../redux/selectors'
import { addToSelectedList, removeFromSelectedList } from '../../../redux/reducers/uploadSlice-reducer'
// import { useUpdateFields } from '../../common/hooks'
import { GalleryProps } from '../../Components/Gallery'
import { removeIntersectingKeywords } from '../../common/utils'
import {
  clearDownloadingState,
  clearDSelectedList,
  fetchPhotos,
  selectAllD,
  setDownloadingFiles,
  updateDOpenMenus,
} from '../../../redux/reducers/mainPageSlice-reducer'
import PaginationMenu from '../../Components/PaginationMenu'

const { Content } = Layout

const MainPage = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector(main)
  const uniqKeywords = useSelector(allDownloadingKeywordsSelector)
  const sameKeywords = useSelector(dAllSameKeywordsSelector)
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const { openMenus, selectedList, imageArr } = mainGalleryProps
  const { currentFolderPath } = useSelector(folderElement)
  // const { updateUploadingFiles } = useUpdateFields()

  useEffect(() => {
    isEmpty(imageArr) && dispatch(fetchPhotos())
  }, [dispatch, imageArr])

  const galleryProps: GalleryProps = {
    ...mainGalleryProps,
    removeFromSelectedList: (index: number) => dispatch(removeFromSelectedList(index)),
    addToSelectedList: (index: number) => dispatch(addToSelectedList(index)),
    clearSelectedList: () => dispatch(clearDSelectedList()),
    updateFiles: (tempPath: string) => {
      console.log('updateUploadingFiles', tempPath)
      // updateUploadingFiles(tempPath)
    },
  }

  const mainMenuProps = {
    uploadingFiles: imageArr,
    selectedList: selectedList,
    loading,
    uniqKeywords,
    sameKeywords,
    openKeys: openMenus,
    currentFolderPath,
    clearSelectedList: () => dispatch(clearDSelectedList()),
    selectAll: () => {
      dispatch(selectAllD())
      // updateUploadingFiles('_', true)
    },
    updateOpenMenus: (value: string[]) => dispatch(updateDOpenMenus(value)),
    updateKeywords: (): Promise<any> => {
      console.log('updateUploadingFiles')
      return Promise.resolve(true)
      // updateUploadingFiles('_', true)
    },
    removeKeyword: (keyword: string) => {
      const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], imageArr)
      dispatch(setDownloadingFiles(filesArrWithoutKeyword))
    },
    removeFiles: () => dispatch(clearDownloadingState()),
  }

  return (
    <Layout>
      <MainMenu {...mainMenuProps} />
      <Layout>
        <Content>
          <CustomAlert message="Edit mode" hide={!openMenus.includes('edit')} type="info" />
          <CustomAlert message="Template mode" hide={!openMenus.includes('template')} type="success" />
          <PaginationMenu />
          <Gallery {...galleryProps} />
          <PaginationMenu />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainPage
