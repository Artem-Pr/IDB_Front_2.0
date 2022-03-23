import React, { useEffect, useMemo, useState } from 'react'
import { Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'ramda'

import { useLocation } from 'react-router-dom'

import { CustomAlert, Gallery, MainMenu } from '../../Components'
import {
  allDownloadingKeywordsSelector,
  curFolderInfo,
  dAllSameKeywordsSelector,
  dPageGalleryPropsSelector,
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
  const location = useLocation()
  const [isFilesLoaded, setIsFilesLoaded] = useState(false)
  const { isExifLoading, isGalleryLoading } = useSelector(main)
  const { currentFolderPath } = useSelector(curFolderInfo)
  const uniqKeywords = useSelector(allDownloadingKeywordsSelector)
  const sameKeywords = useSelector(dAllSameKeywordsSelector)
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const { openMenus, selectedList, imageArr } = mainGalleryProps
  const { updateUploadingFiles } = useUpdateFields(imageArr)

  const query = new URLSearchParams(location.search)
  const isComparisonPage = Boolean(query.get('comparison'))
  const folderParam = query.get('folder') || undefined

  useEffect(() => {
    isEmpty(imageArr) && !isFilesLoaded && dispatch(fetchPhotos(isComparisonPage, folderParam))
    setIsFilesLoaded(true)
  }, [dispatch, folderParam, imageArr, isComparisonPage, isFilesLoaded])

  const galleryProps: GalleryProps = useMemo(
    () => ({
      ...mainGalleryProps,
      removeFromSelectedList: (index: number) => dispatch(removeFromDSelectedList(index)),
      addToSelectedList: (index: number) => dispatch(addToDSelectedList(index)),
      clearSelectedList: () => dispatch(clearDSelectedList()),
      updateFiles: (tempPath: string) => updateUploadingFiles(tempPath),
      isLoading: isGalleryLoading,
      isMainPage: true,
    }),
    [dispatch, isGalleryLoading, mainGalleryProps, updateUploadingFiles]
  )

  const mainMenuProps = useMemo(
    () => ({
      filesArr: imageArr,
      selectedList: selectedList,
      isExifLoading,
      uniqKeywords,
      sameKeywords,
      openKeys: openMenus,
      currentFolderPath,
      isComparisonPage,
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
    }),
    [
      currentFolderPath,
      dispatch,
      imageArr,
      isComparisonPage,
      isExifLoading,
      openMenus,
      sameKeywords,
      selectedList,
      uniqKeywords,
      updateUploadingFiles,
    ]
  )

  return (
    <Layout>
      <MainMenu {...mainMenuProps} />
      <Layout>
        <Content>
          <CustomAlert message="Edit mode" hide={!openMenus.includes('edit')} type="info" />
          <CustomAlert message="Template mode" hide={!openMenus.includes('template')} type="success" />
          {!isComparisonPage && <PaginationMenu />}
          <Gallery {...galleryProps} />
          {!isComparisonPage && <PaginationMenu />}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainPage
