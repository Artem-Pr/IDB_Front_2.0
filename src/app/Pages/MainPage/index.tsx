import React, { useEffect, useState } from 'react'
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
import { useUpdateFields } from '../../common/hooks/hooks'
import { GalleryProps } from '../../Components/Gallery'
import { removeIntersectingKeywords } from '../../common/utils'
import {
  addToDSelectedList,
  clearDownloadingState,
  clearDSelectedList,
  fetchPhotos,
  removeFromDSelectedList,
  selectAllD,
  setDownloadingFiles,
  updateDOpenMenus,
} from '../../../redux/reducers/mainPageSlice-reducer'
import PaginationMenu from '../../Components/PaginationMenu'

const { Content } = Layout

const MainPage = () => {
  const dispatch = useDispatch()
  const [isFilesLoaded, setIsFilesLoaded] = useState(false)
  const { isExifLoading, isGalleryLoading } = useSelector(main)
  const uniqKeywords = useSelector(allDownloadingKeywordsSelector)
  const sameKeywords = useSelector(dAllSameKeywordsSelector)
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const { openMenus, selectedList, imageArr } = mainGalleryProps
  const { currentFolderPath } = useSelector(folderElement)
  const { updateUploadingFiles } = useUpdateFields(imageArr)

  useEffect(() => {
    isEmpty(imageArr) && !isFilesLoaded && dispatch(fetchPhotos())
    setIsFilesLoaded(true)
  }, [dispatch, imageArr, isFilesLoaded])

  const galleryProps: GalleryProps = {
    ...mainGalleryProps,
    removeFromSelectedList: (index: number) => dispatch(removeFromDSelectedList(index)),
    addToSelectedList: (index: number) => dispatch(addToDSelectedList(index)),
    clearSelectedList: () => dispatch(clearDSelectedList()),
    updateFiles: (tempPath: string) => updateUploadingFiles(tempPath),
    isLoading: isGalleryLoading,
    isMainPage: true,
  }

  const mainMenuProps = {
    filesArr: imageArr,
    selectedList: selectedList,
    isExifLoading,
    uniqKeywords,
    sameKeywords,
    openKeys: openMenus,
    currentFolderPath,
    clearSelectedList: () => dispatch(clearDSelectedList()),
    selectAll: () => {
      dispatch(selectAllD())
      updateUploadingFiles('_', true)
    },
    updateOpenMenus: (value: string[]) => dispatch(updateDOpenMenus(value)),
    updateKeywords: (): Promise<any> => updateUploadingFiles('_', true),
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
